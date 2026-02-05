import json
import math
import os
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
import sentencepiece as spm

# -------------------------------------------------------
# import your real recommender
# -------------------------------------------------------
from recommendation import run_lightgbm_ranker


# -------------------------------------------------------
# CONFIG
# -------------------------------------------------------

JSON_INPUT = "lectures.json"
CORPUS_FILE = "corpus.txt"
SP_MODEL = "micro.model"
MODEL_FILE = "micro_llm.pt"
OUTPUT_JSON = "recommended_output.json"

VOCAB_SIZE = 512
BLOCK_SIZE = 64
BATCH_SIZE = 4
EPOCHS = 5
LR = 3e-4

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


# -------------------------------------------------------
# Build corpus
# -------------------------------------------------------

def build_corpus_from_json():

    with open(JSON_INPUT, "r", encoding="utf-8") as f:
        data = json.load(f)

    lines = []

    for course in data["courses"]:

        lines.append(f"\n<course>{course['course_name']}</course>\n")

        for lec in course["lectures"]:

            lines.append(f"<lecture id={lec['lecture_id']}>\n")
            lines.append(f"Title: {lec['title']}\n")
            lines.append(lec["transcript"].strip() + "\n")
            lines.append("</lecture>\n\n")

            lines.append("User: What is this lecture about?\n")
            lines.append(f"Assistant: This lecture explains {lec['title']}.\n\n")

    with open(CORPUS_FILE, "w", encoding="utf-8") as f:
        f.write("".join(lines))

    print("Corpus built:", CORPUS_FILE)


# -------------------------------------------------------
# Tokenizer
# -------------------------------------------------------

def train_tokenizer_if_needed():

    if os.path.exists(SP_MODEL):
        print("Tokenizer already exists.")
        return

    print("Training tokenizer...")

    spm.SentencePieceTrainer.train(
        input=CORPUS_FILE,
        model_prefix="micro",
        vocab_size=VOCAB_SIZE,
        model_type="bpe",
        hard_vocab_limit=False
    )

    print("Tokenizer trained.")


# -------------------------------------------------------
# Dataset
# -------------------------------------------------------

class TextDataset(Dataset):

    def __init__(self, text_file, sp_model, block_size):

        self.sp = spm.SentencePieceProcessor(model_file=sp_model)

        with open(text_file, "r", encoding="utf-8") as f:
            text = f.read()

        ids = self.sp.encode(text)
        self.data = torch.tensor(ids, dtype=torch.long)

        self.block_size = min(block_size, len(self.data) - 1)

        if self.block_size < 2:
            raise RuntimeError("Corpus too small.")

    def __len__(self):
        return max(0, len(self.data) - self.block_size)

    def __getitem__(self, idx):

        x = self.data[idx:idx + self.block_size]
        y = self.data[idx + 1:idx + self.block_size + 1]
        return x, y


# -------------------------------------------------------
# Transformer
# -------------------------------------------------------

class MultiHeadSelfAttention(nn.Module):

    def __init__(self, d_model, n_heads, dropout=0.1):
        super().__init__()
        assert d_model % n_heads == 0

        self.n_heads = n_heads
        self.head_dim = d_model // n_heads
        self.qkv = nn.Linear(d_model, 3 * d_model)
        self.out = nn.Linear(d_model, d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask):

        B, T, C = x.shape

        qkv = self.qkv(x)
        q, k, v = qkv.chunk(3, dim=-1)

        q = q.view(B, T, self.n_heads, self.head_dim).transpose(1, 2)
        k = k.view(B, T, self.n_heads, self.head_dim).transpose(1, 2)
        v = v.view(B, T, self.n_heads, self.head_dim).transpose(1, 2)

        scores = (q @ k.transpose(-2, -1)) / math.sqrt(self.head_dim)
        scores = scores.masked_fill(mask == 0, -1e9)

        att = torch.softmax(scores, dim=-1)
        att = self.dropout(att)

        out = att @ v
        out = out.transpose(1, 2).contiguous().view(B, T, C)

        return self.out(out)


class TransformerBlock(nn.Module):

    def __init__(self, d_model, n_heads, ffn_dim, dropout=0.1):
        super().__init__()

        self.ln1 = nn.LayerNorm(d_model)
        self.attn = MultiHeadSelfAttention(d_model, n_heads, dropout)

        self.ln2 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, ffn_dim),
            nn.GELU(),
            nn.Linear(ffn_dim, d_model),
            nn.Dropout(dropout)
        )

    def forward(self, x, mask):
        x = x + self.attn(self.ln1(x), mask)
        x = x + self.ffn(self.ln2(x))
        return x


class MicroLanguageModel(nn.Module):

    def __init__(
        self,
        vocab_size,
        max_seq_len,
        d_model=256,
        n_layers=4,
        n_heads=4,
        ffn_dim=1024,
        dropout=0.1
    ):
        super().__init__()

        self.token_emb = nn.Embedding(vocab_size, d_model)
        self.pos_emb = nn.Embedding(max_seq_len, d_model)

        self.blocks = nn.ModuleList([
            TransformerBlock(d_model, n_heads, ffn_dim, dropout)
            for _ in range(n_layers)
        ])

        self.ln = nn.LayerNorm(d_model)
        self.head = nn.Linear(d_model, vocab_size)

    def forward(self, x):

        B, T = x.shape
        pos = torch.arange(T, device=x.device)

        h = self.token_emb(x) + self.pos_emb(pos)

        mask = torch.tril(torch.ones(T, T, device=x.device)).view(1, 1, T, T)

        for blk in self.blocks:
            h = blk(h, mask)

        h = self.ln(h)
        return self.head(h)


# -------------------------------------------------------
# Training
# -------------------------------------------------------

def train_model():

    sp = spm.SentencePieceProcessor(model_file=SP_MODEL)
    vocab_size = sp.get_piece_size()

    dataset = TextDataset(CORPUS_FILE, SP_MODEL, BLOCK_SIZE)

    loader = DataLoader(
        dataset,
        batch_size=min(BATCH_SIZE, len(dataset)),
        shuffle=True
    )

    model = MicroLanguageModel(
        vocab_size=vocab_size,
        max_seq_len=dataset.block_size
    ).to(DEVICE)

    opt = torch.optim.AdamW(model.parameters(), lr=LR)

    for epoch in range(EPOCHS):

        model.train()
        total = 0.0

        for x, y in loader:

            x = x.to(DEVICE)
            y = y.to(DEVICE)

            logits = model(x)

            loss = F.cross_entropy(
                logits.view(-1, vocab_size),
                y.view(-1)
            )

            opt.zero_grad()
            loss.backward()
            opt.step()

            total += loss.item()

        print(f"Epoch {epoch+1} | loss = {total / len(loader):.4f}")

    torch.save(model.state_dict(), MODEL_FILE)
    print("Model saved:", MODEL_FILE)


# -------------------------------------------------------
# Inference helpers
# -------------------------------------------------------

def load_model_for_inference():

    sp = spm.SentencePieceProcessor(model_file=SP_MODEL)
    vocab_size = sp.get_piece_size()

    model = MicroLanguageModel(
        vocab_size=vocab_size,
        max_seq_len=BLOCK_SIZE
    ).to(DEVICE)

    model.load_state_dict(torch.load(MODEL_FILE, map_location=DEVICE))
    model.eval()

    return model, sp


def generate_text(model, sp, prompt, max_new_tokens=120, temperature=0.7):

    ids = sp.encode(prompt)
    x = torch.tensor(ids, dtype=torch.long, device=DEVICE)[None, :]

    for _ in range(max_new_tokens):

        x_cond = x[:, -BLOCK_SIZE:]

        with torch.no_grad():
            logits = model(x_cond)

        logits = logits[:, -1, :] / temperature
        probs = torch.softmax(logits, dim=-1)

        next_id = torch.multinomial(probs, 1)
        x = torch.cat([x, next_id], dim=1)

    return sp.decode(x[0].tolist())


# -------------------------------------------------------
# REAL recommender adapter (query-aware)
# -------------------------------------------------------

def real_recommender_from_ranker(user_query, top_k=3):

    with open(JSON_INPUT, "r", encoding="utf-8") as f:
        data = json.load(f)

    def overlap_score(q, t):
        q = set(w.lower() for w in q.split() if len(w) > 2)
        t = set(w.lower() for w in t.split() if len(w) > 2)
        return len(q & t)

    sessions = []
    session_to_lecture = {}

    sid = 0

    for course in data["courses"]:
        for lec in course["lectures"]:

            session_id = f"s{sid}"
            sid += 1

            text = (
                course["course_name"] + " " +
                lec["title"] + " " +
                lec["transcript"]
            )

            hits = overlap_score(user_query, text)

            sessions.append({
                "session_id": session_id,
                "title": lec["title"],
                "teacher_id": lec.get("faculty", "unknown"),
                "price_per_min": 0.0,

                # inject query signal
                "semantic_max": float(hits),
                "semantic_mean": float(hits),
                "semantic_hits": float(hits),

                "reviews": [],
                "difficulty": "beginner",
                "category": course["course_name"],
                "content_embedding": [0.0] * 32
            })

            session_to_lecture[session_id] = lec["lecture_id"]

    input_json = {
        "query": user_query,
        "query_embedding": [0.0] * 32,
        "user": {
            "user_id": "student_1",
            "age_bucket": 2,
            "year_of_study": 2,
            "preferred_categories": [],
            "previous_teachers": []
        },
        "sessions": sessions
    }

    scores = run_lightgbm_ranker(input_json)

    ranked = sorted(
        zip(sessions, scores),
        key=lambda x: x[1],
        reverse=True
    )

    lecture_ids = []
    for s, _ in ranked[:top_k]:
        lecture_ids.append(session_to_lecture[s["session_id"]])

    return lecture_ids


# -------------------------------------------------------
# Lecture objects
# -------------------------------------------------------

def build_recommended_lecture_objects(lecture_ids):

    with open(JSON_INPUT, "r", encoding="utf-8") as f:
        data = json.load(f)

    out = []

    for course in data["courses"]:
        for lec in course["lectures"]:
            if lec["lecture_id"] in lecture_ids:
                out.append({
                    "lecture_id": lec["lecture_id"],
                    "title": lec["title"],
                    "faculty": lec.get("faculty", "Unknown Faculty"),
                    "course": course["course_name"],
                    "transcript": lec["transcript"]
                })

    return out


# -------------------------------------------------------
# Checklist extraction
# -------------------------------------------------------

def extract_checklists(recommended_lectures):

    model, sp = load_model_for_inference()

    bad_words = {
        "alright","everyone","good","morning","today","before",
        "okay","ok","welcome","hello","thanks","thank","sir"
    }

    results = []

    for lec in recommended_lectures:

        prompt = (
            "Extract a short checklist of topics covered in the lecture below.\n"
            "Rules:\n"
            "- only bullet points\n"
            "- 2 to 6 words per bullet\n"
            "- no full sentences\n\n"
            f"Lecture title: {lec['title']}\n\n"
            f"Transcript:\n{lec['transcript']}\n\n"
            "Checklist:\n- "
        )

        raw = generate_text(model, sp, prompt)

        checklist = []
        for line in raw.splitlines():
            line = line.strip()
            if line.startswith("-"):
                checklist.append(line.lstrip("-").strip())

        if not checklist:
            checklist = [x.strip() for x in raw.split(",") if x.strip()]

        cleaned = []
        for x in checklist:
            w = x.lower().strip()
            if w and w not in bad_words and len(w) > 2:
                cleaned.append(x)

        results.append({
            "lecture": lec["title"],
            "faculty": lec["faculty"],
            "course": lec["course"],
            "checklist": cleaned[:8]
        })

    return results


# -------------------------------------------------------
# Main conversational loop
# -------------------------------------------------------

if __name__ == "__main__":

    build_corpus_from_json()
    train_tokenizer_if_needed()

    if not os.path.exists(MODEL_FILE):
        train_model()

    print("\nMicro course assistant is ready.")
    print("Ask what you want to study. Type 'exit' to quit.\n")

    while True:

        user_query = input("Student: ").strip()

        if user_query.lower() in ["exit", "quit"]:
            break

        lecture_ids = real_recommender_from_ranker(user_query, top_k=3)

        lecture_objs = build_recommended_lecture_objects(lecture_ids)

        checklist_output = extract_checklists(lecture_objs)

        print("\nRecommended lectures:\n")

        for item in checklist_output:
            print(f"{item['lecture']} by {item['faculty']}")
            print("here is a checklist of topics")
            for t in item["checklist"]:
                print(t)
            print()

        export = {
            "query": user_query,
            "recommended_lectures": checklist_output
        }

        with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(export, f, indent=2, ensure_ascii=False)

        print("Saved JSON:", OUTPUT_JSON, "\n")

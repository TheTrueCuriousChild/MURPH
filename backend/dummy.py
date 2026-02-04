import json
import numpy as np

# -------------------------
# Model imports
# -------------------------
import lightgbm as lgb
import xgboost as xgb

import torch
import torch.nn as nn


# ============================================================
# Feature utilities
# ============================================================

def build_tabular_feature_vector(session, user):

    # -------------------------------------------------
    # If new-style tabular_features exists → use it
    # -------------------------------------------------
    if "tabular_features" in session:
        tf = session["tabular_features"]

        return np.array([
            session.get("semantic_max", 0.0),
            session.get("semantic_mean", 0.0),
            session.get("semantic_hits", 0.0),

            tf.get("avg_rating", 0.0),
            tf.get("review_credibility", 1.0),
            tf.get("difficulty_id", 0),
            tf.get("category_match", 0),
            tf.get("same_teacher_before", 0),

            user.get("age_bucket", 0),
            user.get("year_of_study", 0)
        ], dtype=np.float32)

    # -------------------------------------------------
    # Otherwise → build features from your OLD dummy JSON
    # -------------------------------------------------

    # average rating from reviews
    reviews = session.get("reviews", [])
    if len(reviews) > 0:
        avg_rating = sum(r.get("rating", 0) for r in reviews) / len(reviews)
        avg_rating = avg_rating / 5.0
    else:
        avg_rating = 0.0

    # difficulty id
    diff_map = {
        "beginner": 0,
        "intermediate": 1,
        "advanced": 2
    }
    difficulty_id = diff_map.get(session.get("difficulty", "").lower(), 0)

    # category match
    preferred = user.get("preferred_categories", [])
    category_match = 1 if session.get("category") in preferred else 0

    # same teacher before
    prev_teachers = user.get("previous_teachers", [])
    same_teacher_before = 1 if session.get("teacher_id") in prev_teachers else 0

    return np.array([
        session.get("semantic_max", 0.0),
        session.get("semantic_mean", 0.0),
        session.get("semantic_hits", 0.0),

        avg_rating,
        1.0,                    # review_credibility (dummy = 1 for now)
        difficulty_id,
        category_match,
        same_teacher_before,

        user.get("age_bucket", 0),
        user.get("year_of_study", 0)
    ], dtype=np.float32)



# temporary label (only for pipeline testing)
# replace later with real engagement label
def pseudo_label(session):

    # use tabular_features if present
    if "tabular_features" in session:
        r = float(session["tabular_features"].get("avg_rating", 0.0))
    else:
        reviews = session.get("reviews", [])
        if not reviews:
            r = 0.0
        else:
            r = sum(x.get("rating", 0) for x in reviews) / len(reviews) / 5.0

    # ---- convert to integer relevance for LambdaMART ----
    # r is in [0,1]  → convert to 0..4
    return int(round(r * 4))



# ============================================================
# 🥇 LightGBM LambdaMART
# ============================================================

def run_lightgbm_ranker(input_json):

    user = input_json["user"]
    sessions = input_json["sessions"]

    X, y = [], []

    for s in sessions:
        X.append(build_tabular_feature_vector(s, user))
        y.append(pseudo_label(s))

    X = np.vstack(X)
    y = np.array(y)

    group = [len(X)]

    dset = lgb.Dataset(X, label=y, group=group)

    params = {
        "objective": "lambdarank",
        "metric": "ndcg",
        "ndcg_eval_at": [5, 10],
        "learning_rate": 0.05,
        "num_leaves": 31,
        "min_data_in_leaf": 5,
        "verbosity": -1
    }

    model = lgb.train(params, dset, num_boost_round=80)

    scores = model.predict(X)
    return scores


# ============================================================
# 🥉 XGBoost ranking
# ============================================================

def run_xgboost_ranker(input_json):

    user = input_json["user"]
    sessions = input_json["sessions"]

    X, y = [], []

    for s in sessions:
        X.append(build_tabular_feature_vector(s, user))
        y.append(pseudo_label(s))

    X = np.vstack(X)
    y = np.array(y)

    dtrain = xgb.DMatrix(X, label=y)
    dtrain.set_group([len(X)])

    params = {
        "objective": "rank:ndcg",
        "eta": 0.05,
        "max_depth": 6,
        "subsample": 0.9,
        "colsample_bytree": 0.9,
        "eval_metric": "ndcg@10"
    }

    model = xgb.train(params, dtrain, num_boost_round=100)

    scores = model.predict(dtrain)
    return scores


# ============================================================
# 🥈 Neural fusion ranker (MLP)
# raw query embedding + content embedding + tabular
# ============================================================

class FusionRanker(nn.Module):

    def __init__(self, emb_dim, tab_dim, hidden=64):
        super().__init__()

        self.semantic = nn.Sequential(
            nn.Linear(emb_dim * 2, hidden),
            nn.ReLU()
        )

        self.tabular = nn.Sequential(
            nn.Linear(tab_dim, hidden),
            nn.ReLU()
        )

        self.final = nn.Sequential(
            nn.Linear(hidden * 2, hidden),
            nn.ReLU(),
            nn.Linear(hidden, 1)
        )

    def forward(self, q, c, t):
        s = self.semantic(torch.cat([q, c], dim=1))
        tb = self.tabular(t)
        x = torch.cat([s, tb], dim=1)
        return self.final(x).squeeze(1)


def run_neural_fusion_ranker(input_json, epochs=300):

    user = input_json["user"]
    sessions = input_json["sessions"]

    q_emb = np.asarray(input_json["query_embedding"], dtype=np.float32)

    tab_X, cont_X, y = [], [], []

    for s in sessions:
        tab_X.append(build_tabular_feature_vector(s, user))
        cont_X.append(np.asarray(s["content_embedding"], dtype=np.float32))
        y.append(pseudo_label(s))

    tab_X = torch.tensor(np.vstack(tab_X))
    cont_X = torch.tensor(np.vstack(cont_X))
    q_X = torch.tensor(np.repeat(q_emb[None, :], len(cont_X), axis=0))
    y = torch.tensor(np.array(y), dtype=torch.float32)

    model = FusionRanker(
        emb_dim=q_X.shape[1],
        tab_dim=tab_X.shape[1]
    )

    opt = torch.optim.Adam(model.parameters(), lr=1e-3)
    loss_fn = nn.MSELoss()

    model.train()
    for _ in range(epochs):
        opt.zero_grad()
        preds = model(q_X, cont_X, tab_X)
        loss = loss_fn(preds, y)
        loss.backward()
        opt.step()

    model.eval()
    with torch.no_grad():
        scores = model(q_X, cont_X, tab_X).cpu().numpy()

    return scores


# ============================================================
# Output builder (same JSON contract as before)
# ============================================================

def build_output_json(input_json, scores):

    results = []

    for s, sc in zip(input_json["sessions"], scores):
        results.append({
            "session_id": s["session_id"],
            "title": s["title"],
            "teacher_id": s["teacher_id"],
            "price_per_min": s["price_per_min"],
            "rank_score": float(sc)
        })

    results.sort(key=lambda x: x["rank_score"], reverse=True)

    return {
        "query": input_json["query"],
        "user_id": input_json["user"]["user_id"],
        "results": results
    }


# ============================================================
# Main runner
# ============================================================

if __name__ == "__main__":

    INPUT_FILE = "input.json"
    OUTPUT_FILE = "output.json"

    # Choose model:
    # "lightgbm", "xgboost", "neural"
    MODEL = "lightgbm"

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        input_json = json.load(f)

    if MODEL == "lightgbm":
        scores = run_lightgbm_ranker(input_json)

    elif MODEL == "xgboost":
        scores = run_xgboost_ranker(input_json)

    elif MODEL == "neural":
        scores = run_neural_fusion_ranker(input_json)

    else:
        raise ValueError("Unknown model type")

    output = build_output_json(input_json, scores)

    print(json.dumps(output, indent=2))

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print("\nSaved:", OUTPUT_FILE)

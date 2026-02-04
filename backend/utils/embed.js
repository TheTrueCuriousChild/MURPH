import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_TOKEN);

function chunk(text, size = 500, overlap = 50) {
  const words = text.split(" ");
  const out = [];
  for (let i = 0; i < words.length; i += size - overlap) {
    out.push(words.slice(i, i + size).join(" "));
  }
  return out;
}

export default async function embedText(text) {
  const chunks = chunk(text);
  const embeddings = [];

  for (const c of chunks) {
    const e = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: c,
    });
    embeddings.push({
      embedding: e[0],
      text: c
    });
  }

  return embeddings;
}

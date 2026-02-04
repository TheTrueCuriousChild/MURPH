import { PineconeClient } from "@pinecone-database/pinecone";

const pinecone = new PineconeClient();

export const initPinecone = async () => {
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
  });
};

export const upsertEmbeddings = async (embeddings) => {
  const index = pinecone.Index("ragdb");

  const vectors = embeddings.map((e, i) => ({
    id: `chunk-${Date.now()}-${i}`,
    values: e.embedding,
    metadata: { text: e.text },
  }));

  await index.upsert({
    upsertRequest: {
      vectors,
    },
  });

  return vectors.length;
};

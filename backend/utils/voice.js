import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

export async function transcribeAudio(audioUrl) {
  const params = {
    audio: audioUrl,
    language_detection: true,
    speech_models: ["universal-3-pro", "universal-2"]
  };

  const transcript = await client.transcripts.transcribe(params);
  return transcript.text;
}

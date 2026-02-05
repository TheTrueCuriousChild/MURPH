import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_TOKEN);

/**
 * Chat with the AI agent to get study topics
 * @param {string} prompt - The user's query
 * @returns {Promise<string>} - The AI response
 */
export const getStudyTopics = async (prompt) => {
    try {
        const systemPrompt = `You are an expert educational advisor. Your task is to analyze the user's request and suggest specific, structured topics they should study to achieve their goal. 
Keep the response professional, concise, and focused on learning objectives. Return a list of suggested topics.`;

        const response = await hf.chatCompletion({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("AI Service Error:", error);
        throw new Error("Failed to get study topics from AI");
    }
};

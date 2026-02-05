import { getStudyTopics } from "../utils/ai.service.js";

/**
 * Handle chat requests to get study topics
 */
export const chatWithAgent = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.sendResponse(400, false, "Message is required");
    }

    try {
        const reply = await getStudyTopics(message);
        return res.sendResponse(200, true, "AI response generated", { reply });
    } catch (error) {
        return res.sendResponse(500, false, "Failed to chat with AI agent", { error: error.message });
    }
};

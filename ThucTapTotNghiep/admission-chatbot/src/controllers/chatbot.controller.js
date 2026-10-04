const aiService = require("../services/ai.service");

const chat = async (req, res) => {
    try {
        const question = req.body.question;
        const sessionId = req.body.sessionId;

        const answer = await aiService.askAI(
            question,
            sessionId
        );

        res.json({
            success: true,
            question: question,
            answer: answer
        });

    } catch (error) {
        console.error("CHATBOT ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    chat
};
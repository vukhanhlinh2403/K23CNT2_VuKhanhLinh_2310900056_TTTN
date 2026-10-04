const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const KNOWLEDGE_STORE =
    "fileSearchStores/admissionchatbotknowledge-rmcp8tdse8g1";


const askRAG = async (question) => {

    try {

        console.log("\n================================");
        console.log("RAG QUERY");
        console.log("================================");

        console.log(
            "Question:",
            question
        );


        const interaction =
            await ai.interactions.create({

                model: "gemini-3.5-flash-lite",

                input: `
Bạn là trợ lý AI tuyển sinh.

Hãy trả lời câu hỏi dựa trên thông tin
được tìm thấy trong Knowledge Base.

Quy tắc:

- Trả lời bằng tiếng Việt.
- Ưu tiên thông tin từ Knowledge Base.
- Không tự bịa thông tin về nhà trường.
- Nếu Knowledge Base không có thông tin,
  hãy nói rõ rằng hệ thống chưa có thông tin.
- Không suy đoán các thông tin chính thức.
- Trả lời ngắn gọn, dễ hiểu.

Câu hỏi của người dùng:
${question}
`,

                tools: [
                    {
                        type: "file_search",

                        file_search_store_names: [
                            KNOWLEDGE_STORE
                        ]
                    }
                ]
            });


        console.log(
            "\nRAG RESPONSE:"
        );


        // ==========================================
        // Lấy text từ Interaction
        // ==========================================

        for (
            const step of interaction.steps || []
        ) {

            if (
                step.type === "model_output"
            ) {

                for (
                    const contentBlock
                    of step.content || []
                ) {

                    if (
                        contentBlock.type === "text"
                    ) {

                        return contentBlock.text;
                    }
                }
            }
        }


        return (
            "Xin lỗi, tôi chưa tìm thấy " +
            "thông tin phù hợp trong Knowledge Base."
        );


    } catch (error) {

        console.error(
            "\nRAG ERROR:"
        );

        console.error(error);

        throw new Error(
            "Không thể truy vấn Knowledge Base."
        );
    }
};


module.exports = {
    askRAG
};
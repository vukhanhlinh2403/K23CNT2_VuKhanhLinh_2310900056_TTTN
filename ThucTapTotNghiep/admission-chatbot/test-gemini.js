require("dotenv").config();

const { askGemini } = require("./src/services/gemini.service");

async function test() {
    try {
        const answer = await askGemini(
            "Bạn có thể giới thiệu ngắn gọn về ngành Công nghệ thông tin không?"
        );

        console.log("\n===== GEMINI RESPONSE =====\n");
        console.log(answer);

    } catch (error) {
        console.error("\n===== GEMINI ERROR =====\n");
        console.error(error.message);
    }
}

test();
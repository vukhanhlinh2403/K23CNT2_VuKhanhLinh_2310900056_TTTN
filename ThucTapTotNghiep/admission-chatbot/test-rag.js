require("dotenv").config();

const {
    askRAG
} = require("./src/services/rag.service");


async function test() {

    try {

        const answer =
            await askRAG(
                "Nhà trường có những nhóm hoạt động câu lạc bộ nào?"
            );

        console.log(
            "\n================================"
        );

        console.log(
            "RAG ANSWER:"
        );

        console.log(
            answer
        );

        console.log(
            "================================"
        );

    } catch (error) {

        console.error(
            "\nRAG TEST ERROR:"
        );

        console.error(
            error.message
        );
    }
}


test();
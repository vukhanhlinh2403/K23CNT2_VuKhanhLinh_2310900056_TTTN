require("dotenv").config();

const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;

const KNOWLEDGE_STORE =
    "fileSearchStores/admissionchatbotknowledge-rmcp8tdse8g1";

const knowledgeDir =
    path.join(__dirname, "knowledge");


// =====================================================
// 1. LẤY DANH SÁCH DOCUMENT HIỆN TẠI
// =====================================================

async function listDocuments() {

    const url =
        `https://generativelanguage.googleapis.com/v1beta/` +
        `${KNOWLEDGE_STORE}/documents?key=${API_KEY}`;

    const response =
        await fetch(url, {
            method: "GET"
        });

    const text =
        await response.text();

    if (!response.ok) {

        throw new Error(
            `Không thể lấy danh sách Document:\n${text}`
        );
    }

    const data =
        JSON.parse(text);

    return data.documents || [];
}


// =====================================================
// 2. XÓA DOCUMENT
// =====================================================

async function deleteDocument(documentName) {

    const url =
        `https://generativelanguage.googleapis.com/v1beta/` +
        `${documentName}?key=${API_KEY}&force=true`;

    const response =
        await fetch(url, {
            method: "DELETE"
        });

    const text =
        await response.text();

    if (!response.ok) {

        throw new Error(
            `Không thể xóa Document ${documentName}:\n${text}`
        );
    }

    console.log(
        "✓ Đã xóa:",
        documentName
    );
}


// =====================================================
// 3. XÓA TOÀN BỘ DOCUMENT CŨ
// =====================================================

async function deleteOldDocuments() {

    console.log("\n================================");
    console.log("KIỂM TRA DOCUMENT CŨ");
    console.log("================================");

    const documents =
        await listDocuments();

    console.log(
        `Tìm thấy ${documents.length} Document cũ.`
    );

    if (documents.length === 0) {

        console.log(
            "Không có Document cũ."
        );

        return;
    }

    for (const document of documents) {

        await deleteDocument(
            document.name
        );
    }

    console.log(
        "\n✓ Đã xóa toàn bộ Document cũ."
    );
}


// =====================================================
// 4. UPLOAD FILE MỚI
// =====================================================

async function uploadFile(fileName) {

    const filePath =
        path.join(
            knowledgeDir,
            fileName
        );

    const fileBuffer =
        fs.readFileSync(filePath);

    const fileSize =
        fileBuffer.length;


    console.log("\n--------------------------------");
    console.log("Đang upload:", fileName);
    console.log(
        "Dung lượng:",
        fileSize,
        "bytes"
    );


    // ============================================
    // START RESUMABLE UPLOAD
    // ============================================

    const startUrl =
        `https://generativelanguage.googleapis.com/upload/v1beta/` +
        `${KNOWLEDGE_STORE}:uploadToFileSearchStore?key=${API_KEY}`;


    const startResponse =
        await fetch(startUrl, {

            method: "POST",

            headers: {

                "X-Goog-Upload-Protocol":
                    "resumable",

                "X-Goog-Upload-Command":
                    "start",

                "X-Goog-Upload-Header-Content-Length":
                    String(fileSize),

                "X-Goog-Upload-Header-Content-Type":
                    "text/plain",

                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                displayName: fileName
            })
        });


    console.log(
        "START status:",
        startResponse.status
    );


    if (!startResponse.ok) {

        const errorText =
            await startResponse.text();

        throw new Error(
            `Không thể khởi tạo upload ${fileName}:\n${errorText}`
        );
    }


    // ============================================
    // LẤY UPLOAD URL
    // ============================================

    const uploadUrl =
        startResponse.headers.get(
            "x-goog-upload-url"
        );


    if (!uploadUrl) {

        throw new Error(
            "Google không trả về x-goog-upload-url."
        );
    }


    console.log(
        "Upload URL đã nhận."
    );


    // ============================================
    // UPLOAD + FINALIZE
    // ============================================

    const uploadResponse =
        await fetch(uploadUrl, {

            method: "POST",

            headers: {

                "Content-Length":
                    String(fileSize),

                "X-Goog-Upload-Offset":
                    "0",

                "X-Goog-Upload-Command":
                    "upload, finalize",

                "Content-Type":
                    "text/plain"
            },

            body: fileBuffer
        });


    console.log(
        "UPLOAD status:",
        uploadResponse.status
    );


    const responseText =
        await uploadResponse.text();


    if (!uploadResponse.ok) {

        throw new Error(
            `Upload ${fileName} thất bại:\n${responseText}`
        );
    }


    console.log(
        "✓ Upload thành công:",
        fileName
    );
}


// =====================================================
// 5. MAIN
// =====================================================

async function setupKnowledge() {

    try {

        console.log("================================");
        console.log("CẬP NHẬT KNOWLEDGE BASE");
        console.log("================================");

        console.log(
            "\nKnowledge Store:"
        );

        console.log(
            KNOWLEDGE_STORE
        );


        // ============================================
        // KIỂM TRA API KEY
        // ============================================

        if (!API_KEY) {

            throw new Error(
                "Không tìm thấy GEMINI_API_KEY trong .env"
            );
        }


        // ============================================
        // KIỂM TRA THƯ MỤC KNOWLEDGE
        // ============================================

        if (!fs.existsSync(knowledgeDir)) {

            throw new Error(
                `Không tìm thấy thư mục: ${knowledgeDir}`
            );
        }


        // ============================================
        // LẤY FILE TXT
        // ============================================

        const files =
            fs.readdirSync(knowledgeDir)
                .filter(
                    file =>
                        file
                            .toLowerCase()
                            .endsWith(".txt")
                );


        if (files.length === 0) {

            throw new Error(
                "Không tìm thấy file .txt nào trong thư mục knowledge."
            );
        }


        console.log(
            `\nTìm thấy ${files.length} tài liệu mới:\n`
        );


        files.forEach(file => {

            console.log(
                " -",
                file
            );

        });


        // ============================================
        // XÓA DOCUMENT CŨ
        // ============================================

        await deleteOldDocuments();


        // ============================================
        // UPLOAD DOCUMENT MỚI
        // ============================================

        console.log("\n================================");
        console.log("UPLOAD DỮ LIỆU MỚI");
        console.log("================================");


        for (const fileName of files) {

            await uploadFile(fileName);

        }


        // ============================================
        // HOÀN TẤT
        // ============================================

        console.log("\n================================");
        console.log("KNOWLEDGE BASE CẬP NHẬT XONG");
        console.log("================================");

        console.log(
            "\nKnowledge Store:"
        );

        console.log(
            KNOWLEDGE_STORE
        );

        console.log(
            "\nSố tài liệu mới:",
            files.length
        );

        console.log(
            "\nRAG có thể sử dụng dữ liệu mới."
        );


    } catch (error) {

        console.error("\n================================");
        console.error("RAG UPDATE ERROR");
        console.error("================================");

        console.error(
            error.message
        );
    }
}


setupKnowledge();
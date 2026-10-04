const FAQ = require("../models/faq.model");
const Admission = require("../models/admission.model");
const Major = require("../models/major.model");
const { askGemini } = require("./gemini.service");
const { askRAG } = require("./rag.service");
// ======================================================
// BỘ INTENT CHUẨN
// ======================================================

const INTENTS = {
    ADMISSION_SCORE: "admission_score",
    TUITION: "tuition",
    QUOTA: "quota",
    ADMISSION_METHOD: "admission_method",

    JOB_OPPORTUNITY: "job_opportunity",
    ADVANCED_STUDY: "advanced_study",
    TRAINING_PROGRAM: "training_program",
    TEACHING_EVALUATION: "teaching_evaluation",
    STUDY_DURATION: "study_duration",

    REQUIRED_DOCUMENTS: "required_documents",
    APPLICATION_SUBMISSION: "application_submission",

    SCHOLARSHIP: "scholarship",
    ACADEMIC_RECORD_ONLINE: "academic_record_online",

    GRADUATION_CONDITION: "graduation_condition",
    GPA_CLASSIFICATION: "gpa_classification",

    UNKNOWN: "unknown"
};

// ======================================================
// CONTEXT HỘI THOẠI
// ======================================================

const conversationContexts = new Map();

const getContext = (sessionId) => {
    if (!sessionId) {
        return {};
    }

    return conversationContexts.get(sessionId) || {};
};

const setContext = (sessionId, data) => {
    if (!sessionId) {
        return;
    }

    const currentContext =
        conversationContexts.get(sessionId) || {};

    conversationContexts.set(sessionId, {
        ...currentContext,
        ...data
    });
};

const clearContext = (sessionId) => {
    if (!sessionId) {
        return;
    }

    conversationContexts.delete(sessionId);
};

// ======================================================
// 1. CHUẨN HÓA CÂU HỎI
// ======================================================

const normalizeQuestion = (question = "") => {
    return question
        .toLowerCase()
        .trim()

        // Ký tự đặc biệt
        .replace(/[?!.,;:()"'`]/g, " ")

        // Viết tắt
        .replace(/\bppgd\b/g, "phương pháp giảng dạy")
        .replace(/\bpp\b/g, "phương pháp")
        .replace(/\bđg\b/g, "đánh giá")

        .replace(/\bcntt\b/g, "công nghệ thông tin")
        .replace(/\bit\b/g, "công nghệ thông tin")

        .replace(/\bsv\b/g, "sinh viên")
        .replace(/\bgv\b/g, "giảng viên")

        .replace(/\bctdt\b/g, "chương trình đào tạo")

        // Khoảng trắng
        .replace(/\s+/g, " ")
        .trim();
};

// ======================================================
// 2. DETECT INTENT
// ======================================================

const detectIntent = (question) => {
    const q = normalizeQuestion(question);

    // ==================================================
    // ĐIỂM CHUẨN
    // ==================================================

    const scoreKeywords = [
        "điểm chuẩn",
        "điểm trúng tuyển",
        "bao nhiêu điểm",
        "lấy bao nhiêu điểm",
        "đậu bao nhiêu",
        "trúng tuyển",
        "điểm xét tuyển"
    ];

    if (
        scoreKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.ADMISSION_SCORE;
    }

    // ==================================================
    // HỌC PHÍ
    // ==================================================

    const tuitionKeywords = [
        "học phí",
        "mức học phí",
        "phí học",
        "tiền học",
        "một năm bao nhiêu tiền",
        "mỗi năm bao nhiêu tiền"
    ];

    if (
        tuitionKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.TUITION;
    }

    // ==================================================
    // CHỈ TIÊU
    // ==================================================

    const quotaKeywords = [
        "chỉ tiêu",
        "tuyển bao nhiêu",
        "bao nhiêu sinh viên",
        "số lượng tuyển"
    ];

    if (
        quotaKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.QUOTA;
    }

    // ==================================================
    // PHƯƠNG THỨC XÉT TUYỂN
    // ==================================================

    const methodKeywords = [
        "phương thức xét tuyển",
        "xét tuyển bằng phương thức nào",
        "xét tuyển như thế nào",
        "cách xét tuyển",
        "hình thức xét tuyển"
    ];

    if (
        methodKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.ADMISSION_METHOD;
    }

    // ==================================================
    // HỌC BỔNG
    // ==================================================

    const scholarshipKeywords = [
        "học bổng",
        "học bổng cho sinh viên",
        "học bổng sinh viên",
        "học bổng đầu vào",
        "học bổng tuyển sinh",
        "học bổng năm nhất",
        "điều kiện học bổng",
        "điều kiện để nhận học bổng",
        "làm sao để nhận học bổng",
        "cách nhận học bổng",
        "đăng ký học bổng",
        "xin học bổng",
        "học bổng bao nhiêu",
        "giá trị học bổng"
    ];

    if (
        scholarshipKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.SCHOLARSHIP;
    }

    // ==================================================
    // NỘP HỌC BẠ ONLINE
    // ==================================================

    const academicRecordKeywords = [
        "nộp học bạ online",
        "nộp học bạ trực tuyến",
        "nộp học bạ online như thế nào",
        "cách nộp học bạ online",
        "hướng dẫn nộp học bạ online",
        "đăng ký học bạ online",
        "xét học bạ online",
        "xét tuyển học bạ",
        "đăng ký xét tuyển học bạ",
        "nộp hồ sơ học bạ",
        "hồ sơ xét học bạ",
        "cách xét học bạ",
        "đăng ký xét học bạ"
    ];

    if (
        academicRecordKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.ACADEMIC_RECORD_ONLINE;
    }

    // ==================================================
    // ĐIỀU KIỆN TỐT NGHIỆP
    // ==================================================

    const graduationKeywords = [
        "điều kiện ra trường",
        "điều kiện tốt nghiệp",
        "điều kiện để ra trường",
        "cần gì để ra trường",
        "gpa để tốt nghiệp",
        "điều kiện để tốt nghiệp"
    ];

    if (
        graduationKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.GRADUATION_CONDITION;
    }

    // ==================================================
    // GPA
    // ==================================================

    const gpaKeywords = [
        "gpa",
        "điểm trung bình",
        "xếp loại",
        "gpa xuất sắc",
        "gpa khá",
        "gpa trung bình"
    ];

    if (
        gpaKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.GPA_CLASSIFICATION;
    }

    // ==================================================
    // THỜI GIAN ĐÀO TẠO
    // ==================================================

    const studyDurationKeywords = [
        "học trong bao lâu",
        "học bao lâu",
        "học mấy năm",
        "học mấy năm thì ra trường",
        "thời gian học",
        "thời gian đào tạo",
        "đào tạo bao lâu",
        "chương trình học bao lâu",
        "mất bao lâu để tốt nghiệp",
        "bao lâu thì tốt nghiệp",
        "khi nào tốt nghiệp",
        "học mấy kỳ",
        "bao nhiêu năm mới ra trường"
    ];

    if (
        studyDurationKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.STUDY_DURATION;
    }

    // ==================================================
    // CƠ HỘI VIỆC LÀM
    // ==================================================

    const jobKeywords = [
        "việc làm",
        "cơ hội việc làm",
        "cơ hội nghề nghiệp",

        "ra trường làm gì",
        "ra trường tôi làm gì",
        "ra trường tôi có thể làm gì",
        "ra trường làm được gì",
        "ra trường có thể làm gì",
        "ra trường sẽ làm gì",

        "ngành ra trường làm gì",
        "ngành tôi ra trường làm gì",
        "ngành này ra trường làm gì",
        "ngành này làm gì",
        "ngành cntt ra trường làm gì",
        "công nghệ thông tin ra trường làm gì",

        "học xong làm gì",
        "học xong tôi làm gì",
        "học xong có thể làm gì",
        "học xong tôi có thể làm gì",

        "sau khi tốt nghiệp",
        "sau khi tốt nghiệp làm gì",
        "sau khi tốt nghiệp tôi làm gì",
        "tốt nghiệp làm gì",
        "tốt nghiệp tôi làm gì",
        "tốt nghiệp có thể làm gì",

        "nghề nghiệp",
        "nghề gì",
        "làm nghề gì",
        "công việc",
        "có thể làm gì",
        "làm ở đâu",
        "xin việc"
    ];

    if (
        jobKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.JOB_OPPORTUNITY;
    }

    // ==================================================
    // HỌC TẬP NÂNG CAO
    // ==================================================

    const advancedKeywords = [
        "học tiếp",
        "học cao học",
        "học thạc sĩ",
        "học tiến sĩ",
        "học nâng cao",
        "học sau đại học",
        "cơ hội học tập nâng cao"
    ];

    if (
        advancedKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.ADVANCED_STUDY;
    }

    // ==================================================
    // CHƯƠNG TRÌNH ĐÀO TẠO
    // ==================================================

    const trainingKeywords = [
        "chương trình đào tạo",
        "quy trình đào tạo",
        "chương trình học",
        "học những gì",
        "học gì",
        "được học gì",
        "các môn học",
        "ctdt"
    ];

    if (
        trainingKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.TRAINING_PROGRAM;
    }

    // ==================================================
    // PHƯƠNG PHÁP GIẢNG DẠY
    // ==================================================

    const teachingKeywords = [
        "phương pháp giảng dạy",
        "phương pháp dạy",
        "cách dạy",
        "giảng dạy như thế nào",
        "đánh giá",
        "thi như thế nào",
        "kiểm tra như thế nào",
        "ppgd"
    ];

    if (
        teachingKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.TEACHING_EVALUATION;
    }

    // ==================================================
    // HỒ SƠ CẦN CHUẨN BỊ
    // ==================================================

    const documentKeywords = [
        "hồ sơ cần gì",
        "hồ sơ gồm gì",
        "hồ sơ gồm những gì",
        "hồ sơ đăng ký xét tuyển gồm những gì",
        "cần giấy tờ gì",
        "giấy tờ gì",
        "chuẩn bị hồ sơ",
        "hồ sơ xét tuyển",
        "cần chuẩn bị gì",
        "hồ sơ nhập học"
    ];

    if (
        documentKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.REQUIRED_DOCUMENTS;
    }

    // ==================================================
    // NỘP HỒ SƠ
    // ==================================================

    const applicationKeywords = [
        "nộp hồ sơ",
        "cách nộp hồ sơ",
        "nộp hồ sơ thế nào",
        "nộp hồ sơ như nào",
        "nộp đơn xét tuyển",
        "nộp online",
        "đăng ký online",
        "nộp hồ sơ xét tuyển"
    ];

    if (
        applicationKeywords.some(keyword =>
            q.includes(keyword)
        )
    ) {
        return INTENTS.APPLICATION_SUBMISSION;
    }

    return INTENTS.UNKNOWN;
};

const getFAQByIntent = async (
    intent,
    question
) => {
    const faqs = await FAQ.find({
        category: intent
    });

    if (!faqs || faqs.length === 0) {
        return null;
    }

    if (faqs.length === 1) {
        return faqs[0].answer;
    }

    const normalizedQuestion =
        normalizeQuestion(question);

    const questionWords =
        normalizedQuestion
            .split(/\s+/)
            .filter(word => word.length >= 2);

    let bestFAQ = null;
    let bestScore = 0;

    for (const faq of faqs) {
        const faqQuestion =
            normalizeQuestion(
                faq.question || ""
            );

        const faqWords =
            faqQuestion
                .split(/\s+/)
                .filter(word => word.length >= 2);

        let score = 0;

        for (const word of questionWords) {
            if (faqWords.includes(word)) {
                score += 1;
            }
        }

        if (
            normalizedQuestion === faqQuestion
        ) {
            score += 100;
        }

        if (
            normalizedQuestion.includes(
                faqQuestion
            )
        ) {
            score += 20;
        }

        if (score > bestScore) {
            bestScore = score;
            bestFAQ = faq;
        }
    }

    if (!bestFAQ || bestScore < 1) {
        return null;
    }

    console.log(
        "→ FAQ phù hợp:",
        bestFAQ.question
    );

    console.log(
        "→ FAQ score:",
        bestScore
    );

    return bestFAQ.answer;
};

// ======================================================
// 4. TÌM NGÀNH
// ======================================================

const findMajor = async (question) => {
    const normalizedQuestion =
        normalizeQuestion(question);

    const majors = await Major.find();

    const matchedMajors = [];

    for (const major of majors) {
        const majorName =
            major.name
                ?.toLowerCase()
                .trim() || "";

        const majorCode =
            major.code
                ?.toLowerCase()
                .trim() || "";

        const matchName =
            majorName &&
            normalizedQuestion.includes(majorName);

        const matchCode =
            majorCode &&
            normalizedQuestion.includes(majorCode);

        if (matchName || matchCode) {
            let score = 0;

            if (matchCode) {
                score += 1000;
            }

            if (matchName) {
                score += majorName.length;
            }

            matchedMajors.push({
                major,
                score
            });
        }
    }

    if (matchedMajors.length === 0) {
        return null;
    }

    matchedMajors.sort(
        (a, b) => b.score - a.score
    );

    return matchedMajors[0].major;
};

// ======================================================
// 5. TÌM ADMISSION CỦA NGÀNH
// ======================================================

const findAdmission = async (majorId) => {
    const admissions = await Admission.find({
        major: majorId
    }).sort({
        year: -1
    });

    if (admissions.length === 0) {
        return null;
    }

    return admissions[0];
};

// ======================================================
// 6. TRẢ LỜI THÔNG TIN NGÀNH
// ======================================================

const answerMajorQuestion = async (
    major,
    intent,
    question
) => {
    const admission =
        await findAdmission(major._id);

    // ================================================
    // ĐIỂM CHUẨN
    // ================================================

    if (intent === INTENTS.ADMISSION_SCORE) {
        if (!admission) {
            return (
                `Hiện chưa có thông tin điểm chuẩn ` +
                `của ngành ${major.name}.`
            );
        }

        return (
            `Ngành ${major.name} có điểm chuẩn ` +
            `${admission.score} điểm theo phương thức ` +
            `${admission.method}` +
            `${admission.year ? ` năm ${admission.year}` : ""}. ` +
            `Chỉ tiêu là ${admission.quota} sinh viên.`
        );
    }

    // ================================================
    // HỌC PHÍ
    // ================================================

    if (intent === INTENTS.TUITION) {
        if (
            major.tuition !== null &&
            major.tuition !== undefined
        ) {
            return (
                `Học phí ngành ${major.name} ` +
                `là ${Number(
                    major.tuition
                ).toLocaleString("vi-VN")} đồng.`
            );
        }

        return (
            `Hiện chưa có thông tin học phí ` +
            `của ngành ${major.name}.`
        );
    }

    // ================================================
    // CHỈ TIÊU
    // ================================================

    if (intent === INTENTS.QUOTA) {
        if (!admission) {
            return (
                `Hiện chưa có thông tin chỉ tiêu ` +
                `của ngành ${major.name}.`
            );
        }

        return (
            `Ngành ${major.name} có chỉ tiêu ` +
            `${admission.quota} sinh viên.`
        );
    }

    // ================================================
    // PHƯƠNG THỨC XÉT TUYỂN
    // ================================================

    if (intent === INTENTS.ADMISSION_METHOD) {
        if (!admission) {
            return (
                `Hiện chưa có thông tin phương thức ` +
                `xét tuyển của ngành ${major.name}.`
            );
        }

        return (
            `Ngành ${major.name} hiện có thông tin ` +
            `xét tuyển theo phương thức ` +
            `"${admission.method}".`
        );
    }

    // ================================================
    // CƠ HỘI VIỆC LÀM
    // ================================================

    if (intent === INTENTS.JOB_OPPORTUNITY) {
        if (
            major.jobOpportunities &&
            major.jobOpportunities.length > 0
        ) {
            return (
                `Sau khi tốt nghiệp ngành ${major.name}, ` +
                `sinh viên có thể làm các vị trí như:\n\n` +
                major.jobOpportunities
                    .map(item => `- ${item}`)
                    .join("\n")
            );
        }

        if (
            major.careerPaths &&
            major.careerPaths.length > 0
        ) {
            return (
                `Sau khi tốt nghiệp ngành ${major.name}, ` +
                `sinh viên có thể theo các hướng nghề nghiệp:\n\n` +
                major.careerPaths
                    .map(item => `- ${item}`)
                    .join("\n")
            );
        }

        return (
            `Hiện chưa có thông tin chi tiết về ` +
            `cơ hội việc làm của ngành ${major.name}.`
        );
    }

    // ================================================
    // HỌC TẬP NÂNG CAO
    // ================================================

    if (intent === INTENTS.ADVANCED_STUDY) {
        if (
            major.advancedStudy &&
            major.advancedStudy.length > 0
        ) {
            return (
                `Sau khi tốt nghiệp ngành ${major.name}, ` +
                `sinh viên có thể tiếp tục học tập theo các hướng:\n\n` +
                major.advancedStudy
                    .map(item => `- ${item}`)
                    .join("\n")
            );
        }

        return (
            `Hiện chưa có thông tin về cơ hội ` +
            `học tập nâng cao của ngành ${major.name}.`
        );
    }

    // ================================================
    // CHƯƠNG TRÌNH ĐÀO TẠO
    // ================================================

    if (intent === INTENTS.TRAINING_PROGRAM) {
        if (major.trainingProgram) {
            return (
                `Chương trình đào tạo ngành ${major.name}:\n\n` +
                major.trainingProgram
            );
        }

        return (
            `Hiện chưa có thông tin chi tiết về ` +
            `chương trình đào tạo ngành ${major.name}.`
        );
    }

    // ================================================
    // PHƯƠNG PHÁP GIẢNG DẠY
    // ================================================

    if (intent === INTENTS.TEACHING_EVALUATION) {
        if (major.teachingMethod) {
            return (
                `Phương pháp giảng dạy và đánh giá ` +
                `của ngành ${major.name}:\n\n` +
                major.teachingMethod
            );
        }

        return (
            `Hiện chưa có thông tin chi tiết về ` +
            `phương pháp giảng dạy và đánh giá ` +
            `của ngành ${major.name}.`
        );
    }

    // ================================================
    // THỜI GIAN ĐÀO TẠO
    // ================================================

    if (intent === INTENTS.STUDY_DURATION) {
        if (major.studyDuration) {
            return (
                `Ngành ${major.name} có thời gian đào tạo ` +
                `${major.studyDuration}.`
            );
        }

        return (
            `Hiện chưa có thông tin chi tiết về ` +
            `thời gian đào tạo của ngành ${major.name}.`
        );
    }

    // ================================================
// KHÔNG XÁC ĐỊNH → RAG
// ================================================

try {

    console.log(
        "→ Không xác định intent ngành, thử Knowledge Base..."
    );

    const ragAnswer =
        await askRAG(question);

    if (
        ragAnswer &&
        !ragAnswer.toLowerCase().includes(
            "chưa tìm thấy thông tin phù hợp"
        )
    ) {

        console.log(
            "→ Trả lời từ RAG"
        );

        return ragAnswer;
    }

} catch (error) {

    console.error(
        "RAG ERROR trong answerMajorQuestion:",
        error.message
    );
}


// ================================================
// RAG không có dữ liệu → GEMINI
// ================================================

const geminiContext = `
Thông tin ngành học từ hệ thống:

Tên ngành: ${major.name}
Mã ngành: ${major.code}

Mô tả:
${major.description || "Chưa có dữ liệu"}

Học phí:
${
    major.tuition !== null &&
    major.tuition !== undefined
        ? Number(major.tuition).toLocaleString("vi-VN") + " đồng"
        : "Chưa có dữ liệu"
}

Thời gian đào tạo:
${major.studyDuration || "Chưa có dữ liệu"}

Cơ hội việc làm:
${
    major.jobOpportunities?.length
        ? major.jobOpportunities.join(", ")
        : "Chưa có dữ liệu"
}

Hướng học tập nâng cao:
${
    major.advancedStudy?.length
        ? major.advancedStudy.join(", ")
        : "Chưa có dữ liệu"
}

Chương trình đào tạo:
${major.trainingProgram || "Chưa có dữ liệu"}

Phương pháp giảng dạy:
${major.teachingMethod || "Chưa có dữ liệu"}

Yêu cầu:
- Đây là thông tin được lấy từ hệ thống tuyển sinh.
- Chỉ sử dụng thông tin được cung cấp.
- Nếu hệ thống không có dữ liệu cho câu hỏi thì phải nói rõ.
- Không được tự bịa thông tin chính thức của trường.
`;

return await askGemini(
    `Câu hỏi của thí sinh: ${question}`,
    geminiContext
);
};

// ======================================================
// 7. ASK AI - CÓ CONTEXT
// ======================================================

const askAI = async (
    question,
    sessionId
) => {
    if (
        !question ||
        !question.trim()
    ) {
        return "Vui lòng nhập câu hỏi.";
    }

    // ================================================
    // Lấy context
    // ================================================

    const context =
        getContext(sessionId);

    // ================================================
    // Chuẩn hóa câu hỏi
    // ================================================

    const normalizedQuestion =
        normalizeQuestion(question);

    console.log(
        "======================================"
    );

    console.log(
        "Câu hỏi:",
        question
    );

    console.log(
        "Session ID:",
        sessionId || "Không có"
    );

    console.log(
        "Context hiện tại:",
        context
    );

    console.log(
        "Chuẩn hóa:",
        normalizedQuestion
    );

    // ================================================
    // Detect Intent
    // ================================================

    const intent =
        detectIntent(
            normalizedQuestion
        );

    console.log(
        "Intent:",
        intent
    );

    // ================================================
    // TÌM NGÀNH TRONG CÂU HỎI
    // ================================================

    const foundMajor =
        await findMajor(
            normalizedQuestion
        );

    // ================================================
    // XÁC ĐỊNH NGÀNH HIỆN TẠI
    // ================================================

    let currentMajor =
        foundMajor;

    // Nếu câu hỏi có ngành mới
    if (foundMajor) {
        currentMajor =
            foundMajor;

        setContext(
            sessionId,
            {
                majorId:
                    foundMajor._id.toString(),

                majorName:
                    foundMajor.name,

                majorCode:
                    foundMajor.code
            }
        );

        console.log(
            "→ Phát hiện ngành mới:",
            foundMajor.name
        );
    }

    // Nếu không có ngành trong câu hỏi
    // thì lấy ngành từ context cũ
    if (
        !currentMajor &&
        context.majorId
    ) {
        try {
            currentMajor =
                await Major.findById(
                    context.majorId
                );

            if (currentMajor) {
                console.log(
                    "→ Sử dụng ngành từ context:",
                    currentMajor.name
                );
            }
        } catch (error) {
            console.error(
                "Lỗi lấy ngành từ context:",
                error.message
            );
        }
    }

    // ================================================
    // NẾU CÓ NGÀNH
    // ================================================

    if (currentMajor) {
        console.log(
            "→ Xử lý theo ngành:",
            currentMajor.name
        );

        const majorIntents = [
            INTENTS.ADMISSION_SCORE,
            INTENTS.TUITION,
            INTENTS.QUOTA,
            INTENTS.ADMISSION_METHOD,
            INTENTS.JOB_OPPORTUNITY,
            INTENTS.ADVANCED_STUDY,
            INTENTS.TRAINING_PROGRAM,
            INTENTS.TEACHING_EVALUATION,
            INTENTS.STUDY_DURATION
        ];

        if (
            majorIntents.includes(intent)
        ) {
            return await answerMajorQuestion(
    currentMajor,
    intent,
    question
);
        }

        if (
            intent === INTENTS.UNKNOWN
        ) {
           return await answerMajorQuestion(
    currentMajor,
    intent,
    question
);
        }
    }

    // ================================================
    // FAQ
    // ================================================

    if (
        intent !== INTENTS.UNKNOWN
    ) {
       const faqAnswer =
    await getFAQByIntent(
        intent,
        normalizedQuestion
    );

        if (faqAnswer) {
            console.log(
                "→ Trả lời từ FAQ"
            );

            return faqAnswer;
        }
    }
// ================================================
// KNOWLEDGE BASE / RAG
// ================================================

try {
    console.log(
        "→ Thử tìm thông tin trong Knowledge Base..."
    );

    const ragAnswer = await askRAG(question);

    if (ragAnswer) {
        const normalizedRagAnswer = String(ragAnswer)
            .toLowerCase()
            .trim();

        const ragNotFound =
            normalizedRagAnswer.includes(
                "chưa tìm thấy thông tin phù hợp"
            ) ||
            normalizedRagAnswer.includes(
                "không tìm thấy thông tin phù hợp"
            ) ||
            normalizedRagAnswer.includes(
                "không có thông tin phù hợp"
            ) ||
            normalizedRagAnswer.includes(
                "chưa có thông tin"
            );

        if (!ragNotFound) {
            console.log(
                "→ Trả lời từ Knowledge Base / RAG"
            );

            return ragAnswer;
        }

        console.log(
            "→ Knowledge Base / RAG không tìm thấy thông tin"
        );
    }

} catch (error) {
    console.error(
        "RAG ERROR:",
        error.message
    );
}
    // ================================================
    // NỘP HỒ SƠ
    // ================================================

    if (
        intent ===
        INTENTS.APPLICATION_SUBMISSION
    ) {
        return (
            "Hiện hệ thống chưa có thông tin chi tiết " +
            "về cách nộp hồ sơ. Vui lòng bổ sung FAQ " +
            "với category 'application_submission'."
        );
    }

    // ================================================
    // HỒ SƠ CẦN CHUẨN BỊ
    // ================================================

    if (
        intent ===
        INTENTS.REQUIRED_DOCUMENTS
    ) {
        return (
            "Hiện hệ thống chưa có thông tin chi tiết " +
            "về hồ sơ cần chuẩn bị. Vui lòng bổ sung FAQ " +
            "với category 'required_documents'."
        );
    }

    // ================================================
    // ĐIỀU KIỆN TỐT NGHIỆP
    // ================================================

    if (
        intent ===
        INTENTS.GRADUATION_CONDITION
    ) {
        return (
            "Hiện hệ thống chưa có thông tin chi tiết " +
            "về điều kiện tốt nghiệp. Vui lòng bổ sung FAQ " +
            "với category 'graduation_condition'."
        );
    }

    // ================================================
    // GPA
    // ================================================

    if (
        intent ===
        INTENTS.GPA_CLASSIFICATION
    ) {
        return (
            "Hiện hệ thống chưa có thông tin chi tiết " +
            "về cách xếp loại GPA. Vui lòng bổ sung FAQ " +
            "với category 'gpa_classification'."
        );
    }

  // ================================================
// KHÔNG TÌM THẤY → GEMINI
// ================================================

const geminiContext = `
Bạn là trợ lý AI tuyển sinh của trường.

Hệ thống hiện chưa tìm thấy dữ liệu phù hợp
trong MongoDB hoặc FAQ cho câu hỏi này.

Quy tắc:
- Trả lời bằng tiếng Việt.
- Có thể giải thích các kiến thức chung liên quan đến tuyển sinh,
  giáo dục và ngành học.
- Không được tự bịa thông tin chính thức của trường.
- Không tự tạo điểm chuẩn, học phí, chỉ tiêu,
  phương thức xét tuyển hoặc quy định của trường.
- Nếu câu hỏi cần thông tin riêng của trường
  nhưng hệ thống chưa có dữ liệu,
  hãy nói rõ rằng hiện chưa có thông tin chính thức.
`;

return await askGemini(
    question,
    geminiContext
);
};
// ======================================================
// 8. XÓA CONTEXT
// ======================================================

const resetConversation = (
    sessionId
) => {
    clearContext(
        sessionId
    );

    return {
        success: true,
        message:
            "Đã xóa context hội thoại."
    };
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
    askAI,
    resetConversation
};
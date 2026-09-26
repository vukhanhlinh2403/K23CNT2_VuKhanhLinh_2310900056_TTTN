const Major = require("../models/Major");
const Admission = require("../models/Admission");
const FAQ = require("../models/FAQ");
const News = require("../models/News");

/**
 * Chuẩn hóa tiếng Việt để nhận diện từ khóa.
 * Ví dụ:
 * "Học phí ngành Công nghệ thông tin?"
 * -> "hoc phi nganh cong nghe thong tin"
 */
const normalizeText = (text = "") => {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

/**
 * Chuyển tên ngành thành dạng viết tắt.
 *
 * Ví dụ:
 * "Công nghệ thông tin"
 * -> "cntt"
 */
const getAcronym = (text = "") => {
    return normalizeText(text)
        .split(" ")
        .filter(Boolean)
        .map(word => word[0])
        .join("");
};

/**
 * Nhận diện ý định của người dùng.
 */
const detectIntent = (question) => {
    const q = normalizeText(question);

    if (
        /(hoc phi|chi phi|tien hoc|hoc phi bao nhieu|hoc phi cua)/.test(q)
    ) {
        return "TUITION";
    }

    if (
        /(hoc nhung gi|hoc gi|mon hoc|cac mon hoc|chuong trinh hoc|chuong trinh dao tao)/.test(q)
    ) {
        return "SUBJECTS";
    }

    if (
        /(ra truong|nghe nghiep|lam gi|lam viec|co the lam|vi tri viec lam|viec lam)/.test(q)
    ) {
        return "CAREER";
    }

    if (
        /(thoi gian dao tao|dao tao bao lau|hoc bao lau|may nam|bao nhieu nam|thoi gian hoc)/.test(q)
    ) {
        return "DURATION";
    }

    if (
        /(phuong thuc|xet tuyen|phuong thuc xet tuyen|cach xet tuyen)/.test(q)
    ) {
        return "ADMISSION_METHOD";
    }

    if (
        /(dieu kien|yeu cau|doi tuong|dieu kien xet tuyen)/.test(q)
    ) {
        return "REQUIREMENTS";
    }

    if (
        /(ho so|giay to|can nop|nop gi|ho so xet tuyen|giay to xet tuyen)/.test(q)
    ) {
        return "DOCUMENTS";
    }

    if (
        /(tin tuc|thong bao|moi nhat|cap nhat|tin moi|thong tin moi)/.test(q)
    ) {
        return "NEWS";
    }

    if (
        /(nganh nao|cac nganh|nganh hoc|ma nganh|gioi thieu nganh|thong tin nganh)/.test(q)
    ) {
        return "MAJOR_INFO";
    }

    return "FAQ";
};

/**
 * Tìm ngành học được nhắc tới trong câu hỏi.
 */
const findMajor = async (question) => {
    const normalizedQuestion = normalizeText(question);

    const majors = await Major.find({
        isActive: true
    }).lean();

    let bestMajor = null;

    for (const major of majors) {
        const name = normalizeText(major.name || "");
        const code = normalizeText(major.code || "");
        const acronym = getAcronym(major.name || "");

        if (!name) {
            continue;
        }

        const nameMatched = normalizedQuestion.includes(name);

        const codeMatched =
            code &&
            normalizedQuestion
                .split(" ")
                .includes(code);

        const acronymMatched =
            acronym &&
            normalizedQuestion
                .split(" ")
                .includes(acronym);

        if (nameMatched || codeMatched || acronymMatched) {
            if (
                !bestMajor ||
                name.length > normalizeText(bestMajor.name || "").length
            ) {
                bestMajor = major;
            }
        }
    }

    return bestMajor;
};

/**
 * Chuyển dữ liệu về mảng.
 */
const toArray = (value) => {
    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value;
    }

    return [value];
};

/**
 * Loại bỏ phần tử trùng nhau.
 */
const uniqueValues = (values) => {
    return [...new Set(
        values
            .filter(Boolean)
            .map(value => String(value).trim())
            .filter(Boolean)
    )];
};

/**
 * Tìm FAQ phù hợp nhất bằng cách tính số từ khóa trùng nhau.
 */
const findBestFAQ = async (question) => {
    const faqs = await FAQ.find({
        isActive: true
    }).lean();

    const questionWords = normalizeText(question)
        .split(" ")
        .filter(word => word.length >= 3);

    let bestFAQ = null;
    let bestScore = 0;

    for (const faq of faqs) {
        const faqText = normalizeText(
            `${faq.question || ""} ${faq.answer || ""}`
        );

        let score = 0;

        for (const word of questionWords) {
            if (faqText.includes(word)) {
                score++;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestFAQ = faq;
        }
    }

    return bestFAQ;
};

/**
 * Tạo câu trả lời cho từng loại ý định.
 */
const generateResponse = async (question) => {
    const intent = detectIntent(question);

    // ==========================================
    // 1. Tìm ngành được hỏi
    // ==========================================

    const major = await findMajor(question);

    // ==========================================
    // 2. Hỏi về học phí
    // ==========================================

    if (intent === "TUITION") {
        if (!major) {
            return {
                answer:
                    "Bạn vui lòng cho biết tên ngành cần hỏi học phí. Ví dụ: \"Học phí ngành Công nghệ thông tin là bao nhiêu?\"",
                intent,
                source: "rule"
            };
        }

        return {
            answer:
                `Học phí ngành ${major.name} là: ${major.tuition || "Hiện chưa có dữ liệu học phí trong hệ thống."}.`,
            intent,
            source: "mongodb"
        };
    }

    // ==========================================
    // 3. Hỏi các môn học
    // ==========================================

    if (intent === "SUBJECTS") {
        if (!major) {
            return {
                answer:
                    "Bạn vui lòng cho biết tên ngành cần hỏi chương trình học. Ví dụ: \"Ngành Công nghệ thông tin học những gì?\"",
                intent,
                source: "rule"
            };
        }

        const subjects = toArray(major.subjects);

        if (subjects.length === 0) {
            return {
                answer:
                    `Hiện tại hệ thống chưa có dữ liệu môn học của ngành ${major.name}.`,
                intent,
                source: "mongodb"
            };
        }

        return {
            answer:
                `Ngành ${major.name} có các môn học/nhóm môn sau:\n` +
                subjects.map((subject, index) => {
                    return `${index + 1}. ${subject}`;
                }).join("\n"),
            intent,
            source: "mongodb"
        };
    }

    // ==========================================
    // 4. Hỏi nghề nghiệp
    // ==========================================

    if (intent === "CAREER") {
        if (!major) {
            return {
                answer:
                    "Bạn vui lòng cho biết tên ngành để tôi tra cứu cơ hội nghề nghiệp.",
                intent,
                source: "rule"
            };
        }

        const careers = major.career || {};
        const careerList = toArray(careers.join);

        if (careerList.length === 0) {
            return {
                answer:
                    `Hiện tại hệ thống chưa có dữ liệu nghề nghiệp của ngành ${major.name}.`,
                intent,
                source: "mongodb"
            };
        }

        return {
            answer:
                `Sau khi tốt nghiệp ngành ${major.name}, sinh viên có thể làm việc ở các vị trí/lĩnh vực:\n` +
                careerList.map((career, index) => {
                    return `${index + 1}. ${career}`;
                }).join("\n"),
            intent,
            source: "mongodb"
        };
    }

    // ==========================================
    // 5. Hỏi thời gian đào tạo
    // ==========================================

    if (intent === "DURATION") {
        if (!major) {
            return {
                answer:
                    "Bạn vui lòng cho biết tên ngành cần hỏi thời gian đào tạo.",
                intent,
                source: "rule"
            };
        }

        return {
            answer:
                `Thời gian đào tạo ngành ${major.name} là: ${major.duration || "Hiện chưa có dữ liệu trong hệ thống."}.`,
            intent,
            source: "mongodb"
        };
    }

    // ==========================================
    // 6. Hỏi thông tin ngành
    // ==========================================

    if (intent === "MAJOR_INFO") {
        if (major) {
            const lines = [
                `Tên ngành: ${major.name}`,
                `Mã ngành: ${major.code || "Chưa cập nhật"}`,
                `Giới thiệu: ${major.description || "Chưa cập nhật"}`,
                `Thời gian đào tạo: ${major.duration || "Chưa cập nhật"}`,
                `Học phí: ${major.tuition || "Chưa cập nhật"}`
            ];

            return {
                answer: lines.join("\n"),
                intent,
                source: "mongodb"
            };
        }

        const majors = await Major.find({
            isActive: true
        })
            .select("name code")
            .lean();

        if (majors.length === 0) {
            return {
                answer:
                    "Hiện tại hệ thống chưa có dữ liệu ngành đào tạo.",
                intent,
                source: "mongodb"
            };
        }

        return {
            answer:
                "Các ngành đào tạo hiện có:\n" +
                majors.map((item, index) => {
                    return `${index + 1}. ${item.name} (${item.code || "Chưa có mã"})`;
                }).join("\n"),
            intent,
            source: "mongodb"
        };
    }

    // ==========================================
    // 7. Hỏi phương thức xét tuyển
    // ==========================================

    if (intent === "ADMISSION_METHOD") {
        const admissions = await Admission.find({
            isActive: true
        }).lean();

        if (admissions.length === 0) {
            return {
                answer:
                    "Hiện tại hệ thống chưa có dữ liệu về phương thức xét tuyển.",
                intent,
                source: "mongodb"
            };
        }

        const methods = uniqueValues(
            admissions.flatMap(item => toArray(item.method))
        );

        if (methods.length === 0) {
            return {
                answer:
                    "Hiện tại hệ thống chưa có dữ liệu về phương thức xét tuyển.",
                intent,
                source: "mongodb"
            };
        }

        return {
            answer:
                "Các phương thức xét tuyển hiện có:\n" +
                methods.map((method, index) => {
                    return `${index + 1}. ${method}`;
                }).join("\n"),
            intent,
            source: "mongodb"
        };
    }

    // ==========================================
    // 8. Hỏi điều kiện xét tuyển
    // ==========================================

    if (intent === "REQUIREMENTS") {
        const admissions = await Admission.find({
            isActive: true
        }).lean();

        if (admissions.length === 0) {
            return {
                answer:
                    "Hiện tại hệ thống chưa có dữ liệu về điều kiện xét tuyển.",
                intent,
                source: "mongodb"
            };
        }

        const requirements = uniqueValues(
            admissions.flatMap(item => toArray(item.requirements))
        );

        if (requirements.length === 0) {
            return {
                answer:
                    "Hiện tại hệ thống chưa có dữ liệu về điều kiện xét tuyển.",
                intent,
                source: "mongodb"
            };
        }

        return {
            answer:
                "Điều kiện xét tuyển hiện có:\n" +
                requirements.map((item, index) => {
                    return `${index + 1}. ${item}`;
                }).join("\n"),
            intent,
            source: "mongodb"
        };
    }

    // ==========================================
    // 9. Hỏi hồ sơ
    // ==========================================

    if (intent === "DOCUMENTS") {
        const admissions = await Admission.find({
            isActive: true
        }).lean();

        if (admissions.length === 0) {
            return {
                answer:
                    "Hiện tại hệ thống chưa có dữ liệu về hồ sơ xét tuyển.",
                intent,
                source: "mongodb"
            };
        }

        const documents = uniqueValues(
            admissions.flatMap(item => toArray(item.documents))
        );

        if (documents.length === 0) {
            return {
                answer:
                    "Hiện tại hệ thống chưa có dữ liệu về hồ sơ xét tuyển.",
                intent,
                source: "mongodb"
            };
        }

        return {
            answer:
                "Hồ sơ/giấy tờ cần chuẩn bị:\n" +
                documents.map((item, index) => {
                    return `${index + 1}. ${item}`;
                }).join("\n"),
            intent,
            source: "mongodb"
        };
    }

    // ==========================================
    // 10. Hỏi tin tức
    // ==========================================

    if (intent === "NEWS") {
        const newsList = await News.find({
            isPublished: true
        })
            .sort({
                publishedAt: -1
            })
            .limit(5)
            .lean();

        if (newsList.length === 0) {
            return {
                answer:
                    "Hiện tại chưa có tin tức tuyển sinh nào được công bố.",
                intent,
                source: "mongodb"
            };
        }

        return {
            answer:
                "Một số tin tức tuyển sinh mới nhất:\n\n" +
                newsList.map((news, index) => {
                    return `${index + 1}. ${news.title}\n${news.content || ""}`;
                }).join("\n\n"),
            intent,
            source: "mongodb"
        };
    }

    // ==========================================
    // 11. FAQ
    // ==========================================

    const faq = await findBestFAQ(question);

    if (faq) {
        return {
            answer: faq.answer,
            intent: "FAQ",
            source: "mongodb"
        };
    }

    // ==========================================
    // 12. Không tìm thấy thông tin
    // ==========================================

    return {
        answer:
            "Xin lỗi, tôi chưa tìm thấy thông tin phù hợp trong dữ liệu tuyển sinh hiện tại. Bạn có thể hỏi về ngành học, học phí, môn học, nghề nghiệp, thời gian đào tạo, phương thức xét tuyển, điều kiện hoặc hồ sơ.",
        intent: "UNKNOWN",
        source: "rule"
    };
};

/**
 * Giữ lại tên hàm generateAIResponse để
 * controller hiện tại không bị lỗi import.
 *
 * Lưu ý:
 * Hàm này KHÔNG gọi AI API.
 */
const generateAIResponse = async (question) => {
    return await generateResponse(question);
};

module.exports = {
    generateAIResponse,
    generateResponse,
    detectIntent,
    normalizeText
};
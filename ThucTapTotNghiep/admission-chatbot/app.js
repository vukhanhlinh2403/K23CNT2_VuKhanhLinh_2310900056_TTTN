const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// ====================
// Middleware
// ====================

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ====================
// Routes
// ====================

const userRoutes = require("./src/routes/user.routes");
const admissionRoutes = require("./src/routes/admission.routes");
const chatbotRoutes = require("./src/routes/chatbot.routes");
const majorRoutes = require("./src/routes/major.routes");
const faqRoutes = require("./src/routes/faq.routes");
const authRoutes = require("./src/routes/auth.routes");

// Rate limit cho Auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        message: "Quá nhiều request. Vui lòng thử lại sau."
    }
});

app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/faqs", faqRoutes);
app.use("/api/majors", majorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/chatbot", chatbotRoutes);

// ====================
// Health check
// ====================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API is running"
    });
});

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Admission Chatbot API đang chạy!"
    });
});

// ====================
// Error Middleware
// ====================

const errorMiddleware = require("./src/middleware/error.middleware");

app.use(errorMiddleware);

// ====================
// Export App
// ====================

module.exports = app;
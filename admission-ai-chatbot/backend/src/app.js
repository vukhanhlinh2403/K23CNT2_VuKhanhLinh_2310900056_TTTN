const express = require("express");
const cors = require("cors");

const majorRoutes = require("./routes/major.routes");
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const adminssionRoutes = require("./routes/admission.routes");
const faqRoutes = require("./routes/faq.routes");
const newsRoutes = require("./routes/news.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Admission AI Chatbot API is running",
        version: "1.0.0"
    });

});


app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        server: "OK"
    });

});


app.use("/api/majors", majorRoutes);
app.use(
    "/api/auth",
    authRoutes
);

app.use("/api/chat", chatRoutes);
app.use("/api/admissions", adminssionRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/news", newsRoutes);
module.exports = app;
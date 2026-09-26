require("dotenv").config();

const app = require("./src/app");
const connectDatabase = require("./src/config/database");

const PORT = process.env.PORT || 5000;


// ================================
// Start server
// ================================

const startServer = async () => {

    try {

        // ================================
        // Kiểm tra Environment
        // ================================

        console.log("Checking environment...");

        console.log(
            "MONGODB_URI:",
            process.env.MONGODB_URI ? "OK" : "MISSING"
        );

        console.log(
            "JWT_ACCESS_SECRET:",
            process.env.JWT_ACCESS_SECRET ? "OK" : "MISSING"
        );

        console.log(
            "JWT_REFRESH_SECRET:",
            process.env.JWT_REFRESH_SECRET ? "OK" : "MISSING"
        );


        // ================================
        // Connect MongoDB
        // ================================

        await connectDatabase();


        // ================================
        // Start server
        // ================================

        app.listen(PORT, () => {

            console.log("=================================");
            console.log("Admission AI Chatbot");
            console.log(`Server running on port ${PORT}`);
            console.log(`http://localhost:${PORT}`);
            console.log("=================================");

        });

    } catch (error) {

        console.error("❌ Không thể khởi động server:");
        console.error(error.message);

        process.exit(1);

    }

};


startServer();
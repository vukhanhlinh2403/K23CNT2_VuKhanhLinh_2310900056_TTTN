require("dotenv").config();

const app = require("./app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 3011;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server đang chạy tại http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(
            "Không thể khởi động server:",
            error.message
        );

        process.exit(1);
    }
};

startServer();
const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("=================================");
        console.log("MongoDB connected successfully");
        console.log("=================================");

    } catch (error) {
        console.error("MongoDB connection failed:");
        console.error(error.message);

        process.exit(1);
    }
};

module.exports = connectDatabase;
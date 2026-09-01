const mongoose = require("mongoose");

const connectDB = async () => {
    let c = 0;
    try {
        console.log("Attempting to connect to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Atlas connected successfully");
    } catch (error) {
        console.log("MongoDB Atlas connection error:", error.message);
        c = 1;
    } finally {
        if(c){
            try{
                console.log("Attempting to connect to MongoDB...");
                await mongoose.connect("mongodb://localhost:27017/BuildFlow");
                console.log("MongoDB connected successfully");
            } catch (error) {
                console.log("MongoDB connection error:", error.message);
                process.exit(1);
            }
        }
    }
};

module.exports = connectDB;
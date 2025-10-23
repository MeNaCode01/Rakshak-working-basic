import mongoose from "mongoose";

const connect = async() =>{
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb+srv://pat:1234@cluster0.dozkaef.mongodb.net/";
        console.log("🔄 Attempting to connect to MongoDB...");
        await mongoose.connect(mongoURI);
        console.log("✅ Successfully connected to MongoDB database!");
        console.log("📍 Connected to:", mongoURI.includes('@') ? mongoURI.split('@')[1]?.split('?')[0] : 'localhost');
    } catch (error) {
        console.log("❌ MongoDB Connection Error:");
        console.log(error.message);
        console.log("Error while connecting to database.");
    }
}

export default connect;
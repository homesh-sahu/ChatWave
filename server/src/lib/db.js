import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(uri, {dbName: "ChatWave"});
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (e){
        console.log(e);
    }
}
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

// amar jana nei je ekhane kon type data আসছে ejonno Promise<void> type kora holo
async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("alrady databse connected to the database...");
        return 
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
        connection.isConnected = db.connections[0].readyState;

        console.log("✅ database connected successful")
    } catch (error) {
        console.log("❌faild to connect DB⚠️",error);
        process.exit(1);
        
    }
}

export default dbConnect;


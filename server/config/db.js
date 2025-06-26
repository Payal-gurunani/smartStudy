import mongoose from "mongoose";
const DBName = "smartStudy";
const connectDb = async () => {
    console.log("MONGO_URI:", process.env.MONGO_URI); // Debug log
        console.log("DBName:", DBName);
    try {
        const connectionDb = await mongoose.connect(`${process.env.MONGO_URI}/${DBName}`)
         // Debug log
       console.log(`✅ MongoDB Connected: ${connectionDb.connection.host}/${DBName}`);        
    } catch (error) {
        console.log("Connection to DB Fail",error);
        process.exit(1);
        
    }
}

export default connectDb;
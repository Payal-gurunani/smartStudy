import mongoose from "mongoose";
const DBName = "smartStudy";
const connectDb = async () => { 
    try {
        const connectionDb = await mongoose.connect(`${process.env.MONGO_URI}/${DBName}`)
       console.log(`✅ MongoDB Connected`);      
    } catch (error) {
        console.log("Connection to DB Fail",error);
        process.exit(1);
        
    }
}

export default connectDb;
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const connectToDb=async()=>{
   try {
    console.log(process.env.MONGO_URL);
    
     await mongoose.connect(process.env.MONGO_URL);
     console.log("database connected successfully")
   } catch (error) {
    console.log(error.message);
    
   }
}

export default connectToDb;

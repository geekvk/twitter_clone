import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDatabase = async() => {
    try{
        await mongoose.connect(ENV.MONGO_URI);
        console.log("Connected to the database")
    }catch(error){
        console.log("Error connecting to the database", error)
        process.exit(1)
    }
}
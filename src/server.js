import express from 'express'
import { ENV } from './config/env.js'
import { connectDatabase } from './config/db.js';
import cors from "cors";
import { clerkMiddleware } from "@clerk/express"

import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"

const app = express()
app.use(cors())
app.use(express.json())

app.use(clerkMiddleware());

app.get("/",(req,res) => {
    res.send("Hello")
});

app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);

const startServer = async() => {
    try{
        await connectDatabase();
        app.listen(ENV.PORT, () => {
            console.log(`App is runing ${ENV.PORT}`)
        })
    }catch(error){
        console.log("Faild to start server", error.message);
        process.exit(1);
    }
}
startServer()
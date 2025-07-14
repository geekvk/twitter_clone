import express from 'express'
import { ENV } from './config/env.js'
import { connectDatabase } from './config/db.js';
import cors from "cors";
import { clerkMiddleware } from "@clerk/express"

import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import commentRoutes from "./routes/comment.route.js"
import notificationRoutes from "./routes/notification.route.js"
import { archjetMiddleware } from './middleware/arcjet.middleware.js';

const app = express()
app.use(cors())
app.use(express.json())

app.use(clerkMiddleware());
app.use(archjetMiddleware);

app.get("/",(req,res) => {
    res.send("Hello")
});

app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/notification", notificationRoutes);

 // error handling middleware
 app.use((err, req, res, next) => {
    console.log("Unhandled error", err);
    res.status(500).json({error : err.message || "Internal server error"});
 });

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
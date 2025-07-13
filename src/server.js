import express from 'express'
import { ENV } from './config/env.js'
import { connectDatabase } from './config/db.js';

const app = express()

app.get("/",(req,res) => {
    res.send("Hello")
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
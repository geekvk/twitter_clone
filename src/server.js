import express from 'express'
import { ENV } from './config/env.js'
import { connectDatabase } from './config/db.js';

const app = express()

connectDatabase();

app.get("/",(req,res) => {
    res.send("Hello")
});

app.listen(ENV.PORT, () => {
    console.log(`App is runing ${ENV.PORT}`)
})
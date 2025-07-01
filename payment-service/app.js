import express from "express";
import { configDotenv } from 'dotenv';
import cors from 'cors';
import register from './routes/userRoute.js'
import errorHandleMiddleware from './middleware/error.js'
import cookieParser from "cookie-parser";

const app  = express()

app.use(cors ({
    origin: "http://localhost:3000"
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/v1', register);
app.use(errorHandleMiddleware)

configDotenv({
    path: 'payment-service/config/config.env'
})

export default app
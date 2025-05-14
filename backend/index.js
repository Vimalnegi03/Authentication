import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import connectToDb from './utils/db.js'
import router from './routes/user.routes.js'
import cookieParser from 'cookie-parser'
const app=express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // if you're using cookies or tokens in headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use(express.json())
app.use(express.urlencoded({extended:true})) //provide me latest encoding and urlencoded basically used to decode data passed through urls
app.use(cookieParser())
connectToDb()
app.use("/api/v1/users",router)

const PORT=process.env.PORT

app.listen(PORT,()=>{
    console.log("server is running on port 8000")
})



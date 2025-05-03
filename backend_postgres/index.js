import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
import userRoutes from "./routes/user.routes.js"
const app=express()

app.use(cors(
    {
        origin: "http://localhost:8080",
        methods:['GET','POST',"PUT","DELETE","PATCH"],
        allowedHeaders:["Content-Type",'Authorization']
    }
))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/users/v1",userRoutes)
app.listen(process.env.PORT,()=>{
    console.log("Server is listening on",process.env.PORT); 
    
})
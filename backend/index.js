import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"

const app = express()

const port = process.env.PORT || 5000

// DATABASE CONNECTION
connectDb()

// MIDDLEWARES
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ai-assistant-frontend-y9p1.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ROUTES
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("API is working")
})

// SERVER START
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
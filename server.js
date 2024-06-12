import express from "express";
import dotenv from "dotenv"
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRouth from "./routes/authRouth.js";
import cors from "cors"
dotenv.config()

// database connection
connectDB()
 
const app = express();


//middleware
app.use(cors())
app.use(express.json()) 
app.use(morgan("dev"))

// routh
app.use("/api/v1/auth",authRouth)

app.get("/", (req, res) => { res.send("server is running")	})


const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
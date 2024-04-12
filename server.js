import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes.js'

const PORT=process.env.PORT || 4000

dotenv.config()

const app=express()
app.use(express.json({limit:"40mb"}))
app.use(cors())

app.use('/',router)

// mongoose.connect(process.env.MONGO_URL)
// .then(()=>console.log("MongoDb connected successfully"))
// .catch(()=>console.log(error,"Mongodb disconnected"))

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDb connected successfully"))
  .catch(error => console.error("MongoDB connection error:", error));



app.listen(PORT,()=>console.log(`server running${PORT}`))
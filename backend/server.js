import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD']
const missingEnv = requiredEnv.filter((key) => !process.env[key])
if (missingEnv.length > 0) {
    console.error(`Missing required environment variables: ${missingEnv.join(', ')}`)
    process.exit(1)
}

// App Config
const app= express()
const port= process.env.PORT || 4000
connectDB().catch((error) => {
    console.error('DB connection failed:', error.message)
    process.exit(1)
})
connectCloudinary()

// Only the listed origins may call the API in production; unset means allow all (local development)
const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean)

// middlewares
app.use(express.json())
app.use(cors(allowedOrigins.length > 0 ? { origin: allowedOrigins } : undefined))

//api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.use((req,res)=>{
    res.status(404).json({ success: false, message: "Route not found" })
})

app.use((err,req,res,next)=>{
    console.log(err)
    res.status(err.status || 400).json({ success: false, message: err.message || "Something went wrong" })
})

app.listen(port,()=> console.log('Server started on PORT : '+port))

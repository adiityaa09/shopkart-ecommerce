import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import customerRoutes from "./routes/customer.routes.js"
import cookieParser from 'cookie-parser'
dotenv.config();

const app = express()
const Port = 8083

app.use(express.json())
app.use(cookieParser())
app.use("/customers", customerRoutes);

mongoose.connect(process.env.dbUrl)
    .then(() => {
        console.log("Db Connected")
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(Port, () => {
    console.log(`Server Started at ${Port}`)
})
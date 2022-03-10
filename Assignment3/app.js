const express=require('express')
const path=require('path')
const userRouter=require('./routes/User')
const homeRouter=require('./routes/home')

const app=express()

app.use(express.static(path.join(__dirname,"public")))
app.use("/api",userRouter)
app.use("/api",homeRouter)



app.listen(3000)
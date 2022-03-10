const http=require('http')
const express=require('express')
const bodyParser=require('body-parser')

const adminRoutes=require('./routes/admin')
const shopRoutes=require('./routes/shop')
const path = require('path')

const PORT=process.env.PORT || 5000

const app=express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public'))) // serving static files

app.use("/admin",adminRoutes)
app.use("/shop",shopRoutes)

app.use((req,res)=>{
    res.status(404).send("<h1>404 not found</h1>")
})


app.listen(PORT,()=>{
    console.log("server up on port ",PORT)
})

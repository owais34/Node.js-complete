const http=require('http')
const express=require('express')
const bodyParser=require('body-parser')

const PORT=process.env.PORT || 5000

const app=express()

app.use(bodyParser.urlencoded({extended:false}))

app.use((req,res,next)=>{
    //console.log("This always runs")
    next()
})

app.use("/add",(req,res,next)=>{
    res.send(`<form action="/product" method="POST"><input type="text" name="title"/><button type="submit">Submit</button></form>`)
})

app.post("/product",(req,res)=>{
    console.log(req.body)
    res.redirect("/")
})

app.use("/",(req,res)=>{
    res.send("Home")
})
app.listen(PORT,()=>{
    console.log("server up on port ",PORT)
})

const express=require('express')

const app=express()

app.use((req,ress,next)=>{
    console.log("First middleware")
    next()
})

app.use((req,res,next)=>{
    console.log("Second middleware")
    next()
})

app.use("/users",(req,res,next)=>{
    req.body=["User1","User2","User3"]
    console.log("In users middleware")
    next()
})

app.use("/users",(req,res,next)=>{
    console.log(req.body)
    res.send(req.body)
})

app.use("/",(req,res,next)=>{
    console.log("in index middleware")
    next()
})

app.use("/",(req,res,next)=>{
    res.send("Homepage")
})


app.listen(5000)
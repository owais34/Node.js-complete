const express=require('express')
const path=require('path')

const router=express.Router()

const products=[]

router.get("/add",(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','add.html'))
})

router.post("/add",(req,res)=>{
    console.log(req.body)
    products.push({"title":req.body.title,})
    res.redirect("/shop")
})

module.exports={router,products}
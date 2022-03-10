const express=require('express')
const path=require('path')

const router=express.Router()


router.get("/add",(req,res,next)=>{
    res.send(path.join(__dirname,'../','views','admin.html'))
})

router.post("/add",(req,res)=>{
    console.log(req.body)
    res.redirect("/")
})

module.exports=router
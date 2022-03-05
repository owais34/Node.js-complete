const {Router }=require('./router')
const fs=require('fs')

const userRouter=new Router();
const userList=[]

userRouter.get("/",(req,res)=>{
    res.setHeader("Content-Type","text/html")
    let html=fs.readFileSync('./index.html')
    res.write(html)
})

userRouter.get("/users",(req,res)=>{
    res.setHeader("Content-Type","text/html")
    res.write("<ul>")
    userList.map(user=>{
        res.write(`<li>${user}</li>`)
    })
    res.write("</ul>")
    res.end()

})

userRouter.post("/create-user",(req,res)=>{
    const body=[]

    req.on("data",chunk=>{
        body.push(chunk)
    })

    return req.on("end",()=>{
        const parseBody=Buffer.concat(body).toString()
        const user=parseBody.split("=")[1]
        console.log(user)
        userList.push(user)
        res.statusCode=302
        res.setHeader('location','/users')
        return res.end()
    })

})


module.exports={
    userRouter
}
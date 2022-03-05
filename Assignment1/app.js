const http=require('http')
const {userRouter}=require('./UserRouter')

const server=http.createServer((req,res)=>{
   
    userRouter.handle(req,res)
})

server.listen(5000,()=>{
    console.log("Server up and running")
})
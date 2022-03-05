const http=require('http')



const server=http.createServer((req,res)=>{
    console.log(req.url,req.method)

    res.setHeader("Content-Type","text/html")
    res.write("boola boola")
    res.end()
})

server.listen(5000,()=>{
    console.log("Server up and running")
})
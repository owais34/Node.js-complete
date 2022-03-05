

class Router{

    constructor(){
        this.routes=[]
    }

    get(route,callback){
        this.routes.push({"path":route,"callback":callback,"method":"GET"})
        
    }
    post(route,callback){
        this.routes.push({"path":route,"callback":callback,"method":"POST"})
        
    }
    handle(req,res){
        
        for(let route of this.routes)
        {
            if(req.url===route["path"] && req.method === route["method"])
            {
                
                route.callback(req,res);
                return;
            }
        }
        
        res.setHeader("Content-Type","text/html")
        res.write("<h1>404 not found</h1>")
        res.statusCodes=404
        res.end()
    }

}

module.exports={
    Router
}



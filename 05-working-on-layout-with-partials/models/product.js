const fs=require('fs')
const path=require('path')

module.exports=class Product{
    constructor(title){
        this.title=title
    }

    save()
    {
        const p=path.join(__dirname,"..",'data','products.json')
        
        fs.readFile(p,(err,fileContent)=>{
            let products=[]

            if(!err)
            {
                products=JSON.parse(fileContent)
            }
            try{
                products.push(this);
                fs.writeFile(p,JSON.stringify(products),(err)=>{
                    //console.log(err)
                })
            }
            catch(e)
            {
                //console.log(e)
            }
            
        })
    }

    static fetchAll(){
        let products=[]
        const p=path.join(__dirname,"..",'data','products.json')
        try{
            const fileContent=fs.readFileSync(p)
            products=JSON.parse(fileContent)
        }
        catch(e)
        {
            console.log(e)
        }
        
        return products
    }
}
const fs=require('fs')
const path=require('path')


const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
  );

class CartDao{
    constructor(filename,idField)
    {
        this.filename=filename
        this.document={"totalPrice":0,products:[]}
        this.idField=idField
        try {
            this.document=JSON.parse(fs.readFileSync(filename))
        } 
        catch (error) {
            fs.writeFileSync(filename,JSON.stringify(this.document))
        }
    }

    addProduct(id,productPrice)
    {
        let productPresent=this.document["products"].filter(prod=>prod.id===id)[0]
        if(productPresent){
            productPresent["qty"]+=1;
        }
        else{
           let product={id,qty:1}
            this.document["products"].push(product)
        }
        this.document["totalPrice"]+=Number(productPrice)
        try{
            fs.writeFileSync(this.filename,JSON.stringify(this.document))
        }
        catch(e)
        {
            console.log(e)
        }
    }
}

const cart=new CartDao(p,'id')

module.exports=cart
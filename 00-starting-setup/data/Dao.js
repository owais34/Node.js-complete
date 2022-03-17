const fs=require('fs')
const path=require('path')


const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
  );

class Dao{
    constructor(filename,idField)
    {
        this.filename=filename
        this.document=[]
        this.idSet=new Set()
        this.idField=idField
        try {
            this.document=JSON.parse(fs.readFileSync(filename))
            this.document.forEach(item=> this.idSet.add(item[idField]))
        } 
        catch (error) {
            fs.writeFileSync(filename,JSON.stringify(this.document))
        }
    }
    getUniqueId()
    {
        let uid=Math.round((Math.random()*10000000)).toString()
        while(this.idSet.has(uid))
        {
            uid=Math.round((Math.random()*10000000)).toString()
        }
        return uid;
    }
    getAll()
    {
        return this.document
    }
    addItem(item)
    {
        item[this.idField]=this.getUniqueId()
        this.idSet.add(item[this.idField])
        this.document.push(item)
        fs.writeFileSync(this.filename,JSON.stringify(this.document))
    }
    getItemById(id)
    {
        return this.document.filter(item=>item[this.idField]===id)[0]
    }
}


const daoProduct=new Dao(p,"id");

module.exports=daoProduct
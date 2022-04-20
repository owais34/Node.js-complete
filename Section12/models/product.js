const getDb = require('../util/database').getDb;
const mongodb=require('mongodb');

const ObjectId=mongodb.ObjectId

class Product {
  constructor(title, price, description, imageUrl,_id,userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id=_id?new ObjectId(_id):null
    this.userId=userId
  }

  save() {
    const db = getDb();
    let dbOp;
    if(this._id){
      console.log(this,"updated")
      dbOp=db.collection('products').updateOne({_id:this._id},
      {$set:this})
    }
   else{
     console.log(this,"inserted")
    dbOp= db.collection('products').insertOne(this)
    }

    return dbOp.then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }
  static findById(prodId){
    const db=getDb()
    return db
    .collection('products')
    .find({_id:new mongodb.ObjectId(prodId)})
    .next()
    .then(prod=>{
      
      return prod
    })
    .catch(err=>console.log(err))
  }
  static deleteById(prodId){
    const db=getDb()
    return db.collection('products').deleteOne({_id:new ObjectId(prodId)})
    .then(result=>console.log('deleted'))
    .catch(err=>console.log(err))
  }
}

module.exports = Product;

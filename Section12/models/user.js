const mongodb=require('mongodb');
const ObjectId=mongodb.ObjectId
const { getDb } = require('../util/database');


class User{
  constructor(username,email,cart,_id){
    this.name=username
    this.email=email
    this.cart=cart?cart:{"items":[]}
    this._id=(_id)?_id:null
  }
  save(){
      const db=getDb()
      return db.collection('users')
      .insertOne(this)
  }
  addToCart(product){
    const cartProduct=this.cart.items.findIndex(cp=>{
      return cp.productId.toString()==product._id.toString()
    })
    
    const updatedCartItems=[...this.cart.items]
    let newQuantity=1;
    
    if(cartProduct>=0)
    {
      newQuantity=this.cart.items[cartProduct].quantity+1
      updatedCartItems[cartProduct].quantity=newQuantity
    }else{
      updatedCartItems.push({productId:product._id,quantity:newQuantity})
    }

  updatedCartItems
  const updatedCart={items:updatedCartItems}
  const db=getDb()
  return db.collection('users').updateOne(
  {_id:new ObjectId(this._id)},
  {$set:{cart:updatedCart}})

  }
  static findById(userId){
    const db=getDb()
    return db.collection('users').findOne({_id:new ObjectId(userId)})
  }

  getCart(){
    let db=getDb()
    const productIds=this.cart.items.map(item=>item.productId)
    return db.collection('products').find({_id:{$in:productIds}})
    .toArray()
    .then(products=>{
      return products.map(product=>{
        return {...product,quantity:this.cart.items.find(i=>i.productId.toString()===product._id.toString()).quantity}
      })
    })
  }

  deleteItemFromCart(productId){
    const updatedCartItems=this.cart.items.filter(item=>{
      return (item.productId.toString()!==productId.toString())
    })

    const db=getDb()
    return db.collection('users').updateOne(
    {_id:new ObjectId(this._id)},
    {$set:{cart:{items:updatedCartItems}}})
  }
  addOrder(){
    const db=getDb()
    return this.getCart()
    .then(products=>{
      
      const order={
        items:products,
        user:{
          _id:new ObjectId(this._id),
          name:this.name,
          name:this.email
        }
      }
      return db.collection('orders').insertOne(order)
    })
    .then(result=>{
      this.cart={items:[]}
      return db.collection('users').updateOne(
        {_id:new ObjectId(this._id)},
        {$set:{cart:{items:[]}}})
    })
  }
  getOrders(){
    const db=getDb()
    return db.collection('orders').find({'user._id':new ObjectId(this._id)}).toArray()
  }
}

module.exports = User;

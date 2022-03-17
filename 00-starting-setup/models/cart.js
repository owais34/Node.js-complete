const fs=require('fs')
const path=require('path')
const cartDao=require('../data/CartDao')

module.exports=class Cart{
    static addProduct(id,price){
        cartDao.addProduct(id,price)
    }
}
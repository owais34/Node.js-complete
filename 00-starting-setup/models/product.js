const fs = require('fs');
const path = require('path');
const daoProduct=require('../data/Dao')



module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    let item=this
    daoProduct.addItem(item)
  }

  static fetchAll(cb) {
    let products=daoProduct.getAll()
    cb(products)
  }

  static findById(id,cb){
    let product=daoProduct.getItemById(id);
    cb(product)
  }
};

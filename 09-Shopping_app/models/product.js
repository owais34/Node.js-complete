const db=require('../util/database')
const Cart = require('./cart');


module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute('INSERT INTO PRODUCTS(title,price,description,imageUrl) VALUES(?,?,?,?)',
    [this.title,this.price,this.description,this.imageUrl])
  }

  static fetchAll() {
    return db.execute('SELECT * FROM PRODUCTS')
  }

  static findById(id) {
    return db.execute('SELECT * FROM PRODUCTS WHERE id=?',[id])
  }
};

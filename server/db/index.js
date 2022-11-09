//this is the access point for all things database related!

const db = require('./db');

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

//associations could go here!
User.hasMany(Order);
Order.belongsTo(User);

module.exports = {
  db,
  models: {
    User,
    Product,
    Order,
  },
};

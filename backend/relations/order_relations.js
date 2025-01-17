const Orders = require('../models/orderModel');
const OrderProducts = require('../models/orderProductModel');
const Products = require('../models/productModel');
const Users = require('../models/userModel');
const Addresses = require('../models/addressModel');
const Payments = require('../models/paymentModel');
const OrderShipments = require('../models/orderShipmentModel');

Orders.belongsTo(Users, { foreignKey: 'user_id' });
Users.hasOne(Orders, { foreignKey: 'user_id' });

OrderProducts.belongsTo(Orders, { foreignKey: 'order_id' });
Orders.hasMany(OrderProducts, { foreignKey: 'order_id' });

OrderProducts.belongsTo(Products, { foreignKey: 'product_id' });
Products.hasMany(OrderProducts, { foreignKey: 'product_id' });

Addresses.belongsTo(Orders, { foreignKey: 'order_id' });
Orders.hasMany(Addresses, { foreignKey: 'order_id' });

Addresses.belongsTo(Users, { foreignKey: 'user_id' });
Users.hasMany(Addresses, { foreignKey: 'user_id' });

Payments.belongsTo(Orders, { foreignKey: 'order_id' });
Orders.hasMany(Payments, { foreignKey: 'order_id' });

OrderShipments.belongsTo(Orders, { foreignKey: 'order_id' });
Orders.hasMany(OrderShipments, { foreignKey: 'order_id' });
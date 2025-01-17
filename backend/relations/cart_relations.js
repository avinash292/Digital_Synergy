const Cart = require('../models/cartModel');
const CartProducts = require('../models/cartProductModel');
const Products = require('../models/productModel');
const Users = require('../models/userModel');
const Colors = require('../models/colorModel');
const Layouts = require('../models/layoutModel');
const Shapes = require('../models/shapeModel');
const Sizes = require('../models/sizeModel');

Cart.belongsTo(Users, { foreignKey: 'user_id' });
Users.hasOne(Cart, { foreignKey: 'user_id' });

CartProducts.belongsTo(Cart, { foreignKey: 'cart_id' });
Cart.hasMany(CartProducts, { foreignKey: 'cart_id' });

CartProducts.belongsTo(Products, { foreignKey: 'product_id' });
Products.hasMany(CartProducts, { foreignKey: 'product_id' });

CartProducts.belongsTo(Colors, { foreignKey: 'color_id' });
Colors.hasMany(CartProducts, { foreignKey: 'color_id' });

CartProducts.belongsTo(Layouts, { foreignKey: 'layout_id' });
Layouts.hasMany(CartProducts, { foreignKey: 'layout_id' });

CartProducts.belongsTo(Shapes, { foreignKey: 'shape_id' });
Shapes.hasMany(CartProducts, { foreignKey: 'shape_id' });

CartProducts.belongsTo(Sizes, { foreignKey: 'size_id' });
Sizes.hasMany(CartProducts, { foreignKey: 'size_id' });
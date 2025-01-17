const Products = require('../models/productModel');
const Shapes = require('../models/shapeModel');
const Colors = require('../models/colorModel');
const Layouts = require('../models/layoutModel');
const Sizes = require('../models/sizeModel');

Shapes.belongsTo(Products, { foreignKey: 'product_id' });
Products.hasMany(Shapes, { foreignKey: 'product_id' });

Colors.belongsTo(Products, { foreignKey: 'product_id' });
Products.hasMany(Colors, { foreignKey: 'product_id' });

Layouts.belongsTo(Products, { foreignKey: 'product_id' });
Products.hasMany(Layouts, { foreignKey: 'product_id' });

Sizes.belongsTo(Products, { foreignKey: 'product_id' });
Products.hasMany(Sizes, { foreignKey: 'product_id' });
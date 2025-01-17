const Customers = require('../models/customerModel');
const User = require('../models/userModel');

Customers.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Customers, { foreignKey: 'user_id' });
const Users = require('../models/userModel');
const Languages = require('../models/languageModel');

Users.belongsTo(Languages, { foreignKey: 'language_id' });
Languages.hasMany(Users, { foreignKey: 'language_id' });
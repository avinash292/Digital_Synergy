const AccessCodes = require('../models/accessCodeModel');
const Users = require('../models/userModel');
const Plans = require('../models/planModel');

AccessCodes.belongsTo(Users, { foreignKey: 'user_id' });
Users.hasMany(AccessCodes, { foreignKey: 'user_id' });

AccessCodes.belongsTo(Plans, { foreignKey: 'plan_id' });
Plans.hasMany(AccessCodes, { foreignKey: 'plan_id' });
const UserPaidPlan = require('../models/userPaidPlanModel');
const User = require('../models/userModel');
const Plans = require('../models/planModel');

UserPaidPlan.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserPaidPlan, { foreignKey: 'user_id' });

UserPaidPlan.belongsTo(Plans, { foreignKey: 'plan_id' });
Plans.hasMany(UserPaidPlan, { foreignKey: 'plan_id' });
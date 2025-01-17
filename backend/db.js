const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
	process.env.DATABASE,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: "mysql",
		logging: false,
	}
);
// const sequelize = new Sequelize("posters-api", "root", "", {
// 	host: process.env.DB_HOST,
// 	dialect: "mysql",
// 	logging: false,
// });
// sequelize.sync({ force: true });
sequelize.sync();
module.exports = sequelize;

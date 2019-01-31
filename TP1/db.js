const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://w4a:w4a@127.0.0.1:5432/W4a');

module.exports = sequelize;

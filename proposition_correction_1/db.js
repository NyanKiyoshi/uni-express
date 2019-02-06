'use strict';

const
Sequelize = require('sequelize');

// create Sequelize instance
const sequelize = new Sequelize('w4a', 'w4a', 'w4aw4aw4a', {
	host: 'localhost',
	port: 3306,
	dialect: 'mysql',
	dialectOptions: { decimalNumbers: true },
	operatorsAliases: false
	// logging: false
});

// create models
const Person = sequelize.define(
	'Person',
	{
		lastname: Sequelize.STRING,
		firstname: Sequelize.STRING
	}
);

const MailAddress = sequelize.define(
	'MailAddress',
	{
		address: {
			type: Sequelize.STRING,
			validate: {
				isEmail: true
			}
		},
		type: Sequelize.ENUM('home', 'work')
	}
);

Person.hasMany(MailAddress, { onDelete: 'CASCADE' });
MailAddress.belongsTo(Person, { onDelete: 'CASCADE' });

// sync DB
sequelize.sync();

// export an object with defined models
module.exports = {
	Person,
	MailAddress
};

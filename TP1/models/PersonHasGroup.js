const Sequelize = require('sequelize');
const db = require("../db");
const Person = require("./Person");
const Group = require("./Group");

const PersonHasGroup = db.define('PersonHasGroup', {
    assocId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    personId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'person_id'
    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'group_id'
    }
}, {
    tableName: 'tbl_person_has_group',
    indexes: [
        {
            unique: true,
            fields: ['group_id', 'person_id']
        }
    ]
});

Person.belongsToMany(Group, {
    as: "groups",
    through: PersonHasGroup,
    foreignKey: 'personId',
    sourceKey: 'personId'
});
Group.belongsToMany(Person, {
    as: "persons",
    through: PersonHasGroup,
    foreignKey: 'groupId',
    targetKey: 'personId'
});

module.exports = PersonHasGroup;

const Sequelize = require('sequelize');
const db = require("../db");
const Person = require("./Person");

const Group = db.define("Group", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    }
});

const PersonHasGroup = db.define('PersonHasGroup', {
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

module.exports = Group;

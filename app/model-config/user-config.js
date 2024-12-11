const { Sequelize, Op } = require('sequelize');
const db = require('../../models');
const { validateUUID } = require('../utils/uuid');

const user = require('../../models/user')(db.sequelize, Sequelize);
class UserConfig {
    constructor() {
        this.fieldMapping = {
            id: 'id',
            userName: 'userName',
            password: 'password',
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
            phoneNumber: 'phoneNumber',
            gender: 'gender',
            dateOfBirth: 'dateOfBirth',
            isAdmin: 'isAdmin',
            profileImageUrl: 'profileImageUrl',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
        };

        this.model = db.user;
        this.modelName = db.user.name;
        this.tableName = db.user.options.tableName;
        this.columnMapping = {
            id: this.model.rawAttributes[this.fieldMapping.id].field,
            userName: this.model.rawAttributes[this.fieldMapping.userName].field,
            password: this.model.rawAttributes[this.fieldMapping.password].field,
            email: this.model.rawAttributes[this.fieldMapping.email].field,
            firstName: this.model.rawAttributes[this.fieldMapping.firstName].field,
            lastName: this.model.rawAttributes[this.fieldMapping.lastName].field,
            phoneNumber: this.model.rawAttributes[this.fieldMapping.phoneNumber].field,
            gender: this.model.rawAttributes[this.fieldMapping.gender].field,
            dateOfBirth: this.model.rawAttributes[this.fieldMapping.dateOfBirth].field,
            isAdmin: this.model.rawAttributes[this.fieldMapping.isAdmin].field,
            profileImageUrl: this.model.rawAttributes[this.fieldMapping.profileImageUrl].field,
            createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
            updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
            deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
        };

        this.association = {
            loan : 'loans',
            query : 'queries'
        };

        this.filters = {
            id: (val) => {
                validateUUID(val);
                return {
                    [`${this.columnMapping.id}`]: {
                        [Op.eq]: val,
                    },
                };
            },
            userName: (val) => {
                return {
                    [`${this.columnMapping.userName}`]: {
                        [Op.like]: `%${val}%`,
                    },
                };
            },
            firstName: (val) => {
                return {
                    [`${this.columnMapping.firstName}`]: {
                        [Op.like]: `%${val}%`,
                    },
                };
            },
            lastName: (val) => {
                return {
                    [`${this.columnMapping.lastName}`]: {
                        [Op.like]: `%${val}%`,
                    },
                };
            },
            email: (val) => {
                return {
                    [`${this.columnMapping.email}`]: {
                        [Op.like]: `%${val}%`,
                    },
                };
            },
            phoneNumber: (val) => {
                return {
                    [`${this.columnMapping.phoneNumber}`]: {
                        [Op.like]: `%${val}%`,
                    },
                };
            },
            dateOfBirth: (val) => {
                return {
                    [`${this.columnMapping.dateOfBirth}`]: {
                        [Op.gte]: val,
                    },
                };
            },
            gender: (val) => {
                return {
                    [`${this.columnMapping.gender}`]: {
                        [Op.like]: `%${val}%`,
                    },
                };
            }
        };
    }
}
const userConfig = new UserConfig();

module.exports = userConfig;
const { Sequelize, Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");

class QueryConfig {
    constructor() {
        this.fieldMapping = {
            id: "id",
            userId: "userId",
            title: "title",
            description: "description",
            status: "status",
            adminRemarks: "adminRemarks",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt",
        };

        this.model = db.query; 
        this.modelName = db.query.name;
        this.tableName = db.query.options.tableName;
        this.columnMapping = {
            id: this.model.rawAttributes[this.fieldMapping.id].field,
            userId: this.model.rawAttributes[this.fieldMapping.userId].field,
            title: this.model.rawAttributes[this.fieldMapping.title].field,
            description: this.model.rawAttributes[this.fieldMapping.description].field,
            status: this.model.rawAttributes[this.fieldMapping.status].field,
            adminRemarks: this.model.rawAttributes[this.fieldMapping.adminRemarks].field,
            createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
            updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
            deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
        };

        this.association = {
            user: "users", 
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
            userId: (val) => {
                validateUUID(val);
                return {
                    [`${this.columnMapping.userId}`]: {
                        [Op.eq]: val,
                    },
                };
            },
            title: (val) => {
                return {
                    [`${this.columnMapping.title}`]: {
                        [Op.like]: `%${val}%`,
                    },
                };
            },
            description: (val) => {
                return {
                    [`${this.columnMapping.description}`]: {
                        [Op.like]: `%${val}%`,
                    },
                };
            },
            status: (val) => {
                return {
                    [`${this.columnMapping.status}`]: {
                        [Op.eq]: val,
                    },
                };
            },
        };
    }
}

const queryConfig = new QueryConfig();

module.exports = queryConfig;
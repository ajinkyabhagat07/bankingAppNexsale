const { Sequelize, Op } = require('sequelize')
const db = require('../../models')
const { validateUUID } = require('../utils/uuid')


const customer = require('../../models/customer')(db.sequelize,Sequelize)
class CustomerConfig {
    constructor() {
        this.fieldMapping = {
            id: 'id',
            userName : "userName",
            password : "password",
            firstName: 'firstName',
            lastName : "lastName",
            age : "age",
            gender : "gender",
            isAdmin : "isAdmin",
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
        }
        
        this.model = db.customer
        this.modelName = db.customer.name
        this.tableName = db.customer.options.tableName
        this.columnMapping = {
            id: this.model.rawAttributes[this.fieldMapping.id].field,
            userName : this.model.rawAttributes[this.fieldMapping.userName].field,
            password : this.model.rawAttributes[this.fieldMapping.password].field,
            firstName: this.model.rawAttributes[this.fieldMapping.firstName].field,
            lastName: this.model.rawAttributes[this.fieldMapping.lastName].field,
            age: this.model.rawAttributes[this.fieldMapping.age].field,
            gender: this.model.rawAttributes[this.fieldMapping.gender].field,
            isAdmin: this.model.rawAttributes[this.fieldMapping.isAdmin].field,
            createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
            updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
            deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
        }

        this.association = {
            account: 'account'
        }


        this.filters = {
            id: (val) => {
                validateUUID(val)
                return {
                    [`${this.columnMapping.id}`]: {
                        [Op.eq]: val
                    }
                }
            },
            userName: (val) => {
                return {
                    [`${this.columnMapping.userName}`]: {
                        [Op.like]: `%${val}%`
                    }
                }
            },

            firstName: (val) => {
                return {
                    [`${this.columnMapping.firstName}`]: {
                        [Op.like]: `%${val}%`
                    }
                }
            },
            lastName: (val) => {
                return {
                    [`${this.columnMapping.lastName}`]: {
                        [Op.like]: `%${val}%`
                    }
                }
            },
            fromAge: (val) => {
                return {
                    [`${this.columnMapping.age}`]: {
                        [Op.gte]: val
                    }
                }
            },
            toAge: (val) => {
                return {
                    [`${this.columnMapping.age}`]: {
                        [Op.lte]: val
                    }
                }
            },
            gender: (val) => {
                return {
                    [`${this.columnMapping.gender}`]: {
                        [Op.like]: `%${val}%`
                    }
                }
            }
        }

    }


}
const customerConfig = new CustomerConfig()

module.exports = customerConfig
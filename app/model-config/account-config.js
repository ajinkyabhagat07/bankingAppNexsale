const { Sequelize, Op } = require('sequelize')
const db = require('../../models')
const { validateUUID } = require('../utils/uuid')



const account = require('../../models/account')(db.sequelize,Sequelize)
class AccountConfig {
    constructor() {
        this.fieldMapping = {
            id: 'id',
            accountNumber: "accountNumber",
            customerId : "customerId",
            bankId : "bankId",
            accountBalance : "accountBalance",
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
        }
        
        this.model = db.account
        this.modelName = db.account.name
        this.tableName = db.account.options.tableName
        this.columnMapping = {
            id: this.model.rawAttributes[this.fieldMapping.id].field,
            accountNumber : this.model.rawAttributes[this.fieldMapping.accountNumber].field,
            customerId : this.model.rawAttributes[this.fieldMapping.customerId].field,
            bankId : this.model.rawAttributes[this.fieldMapping.bankId].field,
            accountBalance : this.model.rawAttributes[this.fieldMapping.accountBalance].field,
            createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
            updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
            deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
        }

        this.association = {
            passbook: 'passbook'
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
            accountNumber: (val) => {
                return {
                    [`${this.columnMapping.accountNumber}`]: {
                        [Op.eq]: val
                    }
                }
            },
            customerId: (val) => {
                return {
                    [`${this.columnMapping.customerId}`]: {
                        [Op.eq]: val
                    }
                }
            }
        }

    }


}
const accountConfig = new AccountConfig()

module.exports = accountConfig;
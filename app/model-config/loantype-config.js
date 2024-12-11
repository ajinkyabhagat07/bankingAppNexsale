const { Sequelize, Op } = require('sequelize');
const db = require('../../models');

const loanType = require('../../models/loantype')(db.sequelize, Sequelize);
class LoanTypeConfig {
    constructor() {
        this.fieldMapping = {
            id: 'id',
            loanName: 'loanName',
            requiredDocuments: 'requiredDocuments',
            interestRate: 'interestRate',
            minAmount: 'minAmount',
            maxAmount: 'maxAmount',
            minRepayTenure: 'minRepayTenure',
            maxRepayTenure: 'maxRepayTenure',
            eligibilityCriteria: 'eligibilityCriteria',
            minAge : 'minAge',
            minSalary : 'minSalary',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
        };

        this.model = db.loanType;
        this.modelName = db.loanType.name;
        this.tableName = db.loanType.options.tableName;
        this.columnMapping = {
            id: this.model.rawAttributes[this.fieldMapping.id].field,
            loanName: this.model.rawAttributes[this.fieldMapping.loanName].field,
            requiredDocuments: this.model.rawAttributes[this.fieldMapping.requiredDocuments].field,
            interestRate: this.model.rawAttributes[this.fieldMapping.interestRate].field,
            minAmount: this.model.rawAttributes[this.fieldMapping.minAmount].field,
            maxAmount: this.model.rawAttributes[this.fieldMapping.maxAmount].field,
            minRepayTenure: this.model.rawAttributes[this.fieldMapping.minRepayTenure].field,
            maxRepayTenure: this.model.rawAttributes[this.fieldMapping.maxRepayTenure].field,
            eligibilityCriteria: this.model.rawAttributes[this.fieldMapping.eligibilityCriteria].field,
            minAge: this.model.rawAttributes[this.fieldMapping.minAge].field,
            minSalary: this.model.rawAttributes[this.fieldMapping.minSalary].field,
            createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
            updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
            deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
        };

        this.association = {
            // Define associations here if needed
        };

        this.filters = {
            id: (val) => {
                return {
                    [`${this.columnMapping.id}`]: {
                        [Op.eq]: val,
                    },
                };
            },
            loanName: (val) => {
                return {
                    [`${this.columnMapping.loanName}`]: {
                        [Op.like]: `%${val}%`,
                    },
                };
            },
            interestRate: (val) => {
                return {
                    [`${this.columnMapping.interestRate}`]: {
                        [Op.eq]: val,
                    },
                };
            },
            minAmount: (val) => {
                return {
                    [`${this.columnMapping.minAmount}`]: {
                        [Op.gte]: val,
                    },
                };
            },
            maxAmount: (val) => {
                return {
                    [`${this.columnMapping.maxAmount}`]: {
                        [Op.lte]: val,
                    },
                };
            },
            minRepayTenure: (val) => {
                return {
                    [`${this.columnMapping.minRepayTenure}`]: {
                        [Op.gte]: val,
                    },
                };
            },
            maxRepayTenure: (val) => {
                return {
                    [`${this.columnMapping.maxRepayTenure}`]: {
                        [Op.lte]: val,
                    },
                };
            },
            minAge : (val) => {
                return {
                    [`${this.columnMapping.minAge}`]: {
                        [Op.gte]: val,
                    },
                };
            },
            minSalary :  (val) => {
                return {
                    [`${this.columnMapping.minSalary}`]: {
                        [Op.gte]: val,
                    },
                };
            },
        };
    }
}
const loanTypeConfig = new LoanTypeConfig();

module.exports = loanTypeConfig;

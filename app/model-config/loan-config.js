const { Sequelize, Op } = require('sequelize');
const db = require('../../models');

const loan = require('../../models/loan')(db.sequelize, Sequelize);
class LoanConfig {
    constructor() {
        this.fieldMapping = {
            id: 'id',
            loanTypeId: 'loanTypeId',
            customerId: 'customerId',
            aadhar:"aadhar",
            pan : "pan",
            additionalDocument : "additionalDocument",
            loanAmount: 'loanAmount',
            address : 'address',
            durationMonths: 'durationMonths',
            emiAmount: 'emiAmount',
            loanStatus: 'loanStatus',
            reasonForRejection: 'reasonForRejection',
            appliedDate: 'appliedDate',
            approvedDate: 'approvedDate',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
        };

        this.model = db.loan;
        this.modelName = db.loan.name;
        this.tableName = db.loan.options.tableName;
        this.columnMapping = {
            id: this.model.rawAttributes[this.fieldMapping.id].field,
            loanTypeId: this.model.rawAttributes[this.fieldMapping.loanTypeId].field,
            customerId: this.model.rawAttributes[this.fieldMapping.customerId].field,
            aadhar : this.model.rawAttributes[this.fieldMapping.aadhar].field,
            pan : this.model.rawAttributes[this.fieldMapping.pan].field,
            additionalDocument : this.model.rawAttributes[this.fieldMapping.additionalDocument].field,
            loanAmount: this.model.rawAttributes[this.fieldMapping.loanAmount].field,
            address : this.model.rawAttributes[this.fieldMapping.address].field,
            durationMonths: this.model.rawAttributes[this.fieldMapping.durationMonths].field,
            emiAmount: this.model.rawAttributes[this.fieldMapping.emiAmount].field,
            loanStatus: this.model.rawAttributes[this.fieldMapping.loanStatus].field,
            reasonForRejection: this.model.rawAttributes[this.fieldMapping.reasonForRejection].field,
            appliedDate: this.model.rawAttributes[this.fieldMapping.appliedDate].field,
            approvedDate: this.model.rawAttributes[this.fieldMapping.approvedDate].field,
            createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
            updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
            deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
        };

        this.association = {
            emi : 'emis'
        };

        this.filters = {
            id: (val) => {
                return {
                    [`${this.columnMapping.id}`]: {
                        [Op.eq]: val,
                    },
                };
            },
            loanTypeId: (val) => {
                return {
                    [`${this.columnMapping.loanTypeId}`]: {
                        [Op.eq]: val,
                    },
                };
            },
            customerId: (val) => {
                return {
                    [`${this.columnMapping.customerId}`]: {
                        [Op.eq]: val,
                    },
                };
            },
            aadhar : (val) => {
                return {
                    [`${this.columnMapping.aadhar}`] : {
                        [Op.like] : `%${val}%`
                    }
                }
            },
            pan : (val) => {
                return {
                    [`${this.columnMapping.pan}`] : {
                        [Op.like] : `%${val}%`
                    }
                }
            },
            
            loanAmount: (val) => {
                return {
                    [`${this.columnMapping.loanAmount}`]: {
                        [Op.gte]: val,
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
            durationMonths: (val) => {
                return {
                    [`${this.columnMapping.durationMonths}`]: {
                        [Op.eq]: val,
                    },
                };
            },
            loanStatus: (val) => {
                return {
                    [`${this.columnMapping.loanStatus}`]: {
                        [Op.eq]: val,
                    },
                };
            },
            appliedDate: (val) => {
                return {
                    [`${this.columnMapping.appliedDate}`]: {
                        [Op.gte]: val,
                    },
                };
            },
            approvedDate: (val) => {
                return {
                    [`${this.columnMapping.approvedDate}`]: {
                        [Op.eq]: val,
                    },
                };
            },
        };
    }
}
const loanConfig = new LoanConfig();

module.exports = loanConfig;

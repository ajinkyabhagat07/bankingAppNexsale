const { Sequelize, Op } = require('sequelize');
const db = require('../../models');

const emi = require('../../models/emi')(db.sequelize, Sequelize);

class EmiConfig {
    constructor() {
        this.fieldMapping = {
            id: 'id',
            accountNumber: 'accountNumber',
            loanId: 'loanId',
            amount: 'amount',
            dueDate: 'dueDate',
            paymentDate: 'paymentDate',
            status: 'status',
            totalEmis: 'totalEmis',
            remainingEmis: 'remainingEmis',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
        };

        this.model = db.emi;
        this.modelName = db.emi.name;
        this.tableName = db.emi.options.tableName;

        this.columnMapping = {
            id: this.model.rawAttributes[this.fieldMapping.id].field,
            accountNumber: this.model.rawAttributes[this.fieldMapping.accountNumber].field,
            loanId: this.model.rawAttributes[this.fieldMapping.loanId].field,
            amount: this.model.rawAttributes[this.fieldMapping.amount].field,
            dueDate: this.model.rawAttributes[this.fieldMapping.dueDate].field,
            paymentDate: this.model.rawAttributes[this.fieldMapping.paymentDate].field,
            status: this.model.rawAttributes[this.fieldMapping.status].field,
            totalEmis: this.model.rawAttributes[this.fieldMapping.totalEmis].field,
            remainingEmis: this.model.rawAttributes[this.fieldMapping.remainingEmis].field,
            createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
            updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
            deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
        };

        this.association = {
            
        };

        this.filters = {
            id: (val) => ({
                [`${this.columnMapping.id}`]: {
                    [Op.eq]: val,
                },
            }),
            accountNumber: (val) => ({
                [`${this.columnMapping.accountNumber}`]: {
                    [Op.eq]: val,
                },
            }),
            loanId: (val) => ({
                [`${this.columnMapping.loanId}`]: {
                    [Op.eq]: val,
                },
            }),
            amount: (val) => ({
                [`${this.columnMapping.amount}`]: {
                    [Op.gte]: val,
                },
            }),
            dueDate: (val) => ({
                [`${this.columnMapping.dueDate}`]: {
                    [Op.gte]: val,
                },
            }),
            paymentDate: (val) => ({
                [`${this.columnMapping.paymentDate}`]: {
                    [Op.eq]: val,
                },
            }),
            status: (val) => ({
                [`${this.columnMapping.status}`]: {
                    [Op.eq]: val,
                },
            }),
            totalEmis: (val) => ({
                [`${this.columnMapping.totalEmis}`]: {
                    [Op.gte]: val,
                },
            }),
            remainingEmis: (val) => ({
                [`${this.columnMapping.remainingEmis}`]: {
                    [Op.lte]: val,
                },
            }),
        };
    }
}

const emiConfig = new EmiConfig();

module.exports = emiConfig;
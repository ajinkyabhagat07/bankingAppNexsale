'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loanType extends Model {
    static associate(models) {
      // Define associations
      loanType.hasMany(models.loan);
    }
  }
  loanType.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    loanName: DataTypes.STRING,
    requiredDocuments: DataTypes.TEXT,
    interestRate: DataTypes.DECIMAL,
    minAmount: DataTypes.DECIMAL,
    maxAmount: DataTypes.DECIMAL,
    minRepayTenure: DataTypes.INTEGER,
    maxRepayTenure: DataTypes.INTEGER,
    eligibilityCriteria: DataTypes.TEXT,
    minAge : DataTypes.INTEGER,
    minSalary : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'loanType',
    underscored: true,
    paranoid: true,
  });
  return loanType;
};
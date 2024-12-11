'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class emi extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      
      emi.belongsTo(models.loan, { 
        foreignKey: 'loanId', as: 'loan' 
      });
    }
  }

  emi.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4, 
      },
      accountNumber: DataTypes.STRING,
      loanId:DataTypes.UUID,
      amount: DataTypes.DECIMAL(10, 2),
      paymentDate: DataTypes.DATE,
      dueDate: DataTypes.DATE,
      status: DataTypes.ENUM('Pending', 'Paid', 'Overdue', 'Failed', 'Cancelled'),
      totalEmis: DataTypes.INTEGER,
      remainingEmis: DataTypes.INTEGER,   
    },
    {
      sequelize,
      modelName: 'emi',
      underscored: true,
      paranoid: true, 
    }
  );

  return emi;
};
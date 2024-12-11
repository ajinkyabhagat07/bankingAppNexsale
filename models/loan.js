'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with User (Customer)
     
        loan.belongsTo(models.user, {
            foreignKey: 'customerId', 
        });

        loan.hasMany(models.emi, { 
          foreignKey: 'loanId', as: 'emis' 
        });
  
    }
  }
  loan.init({
    loanTypeId: DataTypes.UUID,
    customerId: DataTypes.UUID,
    aadhar: DataTypes.STRING,
    pan: DataTypes.STRING,
    additionalDocument: DataTypes.STRING,
    loanAmount: DataTypes.DECIMAL,
    address: DataTypes.TEXT,
    durationMonths: DataTypes.INTEGER,
    emiAmount: DataTypes.DECIMAL,
    loanStatus: DataTypes.STRING,
    reasonForRejection: DataTypes.TEXT,
    appliedDate: DataTypes.DATE,
    approvedDate: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
}, {
    sequelize,
    modelName: 'loan',
    underscored: true,
    paranoid: true,
});
  return loan;
};


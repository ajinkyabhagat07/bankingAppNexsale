'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.loan, {
        foreignKey: 'customerId',
      });

      user.hasMany(models.query, {
        as: "queries",
        foreignKey: "userId",
      });
    }
  }
  user.init({
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    isAdmin: DataTypes.BOOLEAN,
    profileImageUrl: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'user',
    underscored: true,
    paranoid:true
  });
  return user;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class query extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      query.belongsTo(models.user, {
        as: "user",
        foreignKey: "userId",
      });
    }
  }
  query.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
    adminRemarks: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'query',
    underscored: true,
    paranoid: true,
  });
  return query;
};
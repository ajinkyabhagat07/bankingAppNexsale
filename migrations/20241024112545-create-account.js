'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      account_number: {
        type: Sequelize.INTEGER
      },
      customer_id :{
        type: Sequelize.UUID,
        references: { key: "id", model: "customers" },
        onDelete:"CASCADE",
        allowNull: false,
      },
      bank_id: {
        type: Sequelize.UUID,
        references: { key: "id", model: "banks" },
        onDelete:"CASCADE"
      },
      account_balance :{
        type : Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('accounts');
  }
};
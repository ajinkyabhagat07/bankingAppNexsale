'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loan_types', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      loan_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      required_documents: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      interest_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      min_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      max_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      min_repay_tenure: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      max_repay_tenure: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      eligibility_criteria: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      min_age : {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      min_salary : {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('loan_types');
  },
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
    },
    loan_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'loan_types', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    customer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
      aadhar: {
        type: Sequelize.STRING,
      },
      pan: {
        type: Sequelize.STRING,
      },
      additional_document: {
        type: Sequelize.STRING,
      },
      loan_amount: {
        type: Sequelize.DECIMAL(15, 2)
      },
      address: {
        type: Sequelize.TEXT,
      },
      duration_months: {
        type: Sequelize.INTEGER
      },
      emi_amount: {
        type: Sequelize.DECIMAL(15, 2)
      },
      loan_status: {
        type: Sequelize.STRING
      },
      reason_for_rejection: {
        type: Sequelize.TEXT
      },
      applied_date: {
        type: Sequelize.DATE
      },
      approved_date: {
        type: Sequelize.DATE
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
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('loans');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emis', {
      
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      loan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'loans', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Paid', 'Overdue', 'Failed', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Pending',
      },
      total_emis: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      remaining_emis: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('emis');
  },
};
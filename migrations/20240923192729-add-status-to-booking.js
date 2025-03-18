'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bookings', 'status', {
      type: Sequelize.ENUM('pending', 'finalized', 'completed', 'canceled'),
      defaultValue: 'pending',
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bookings', 'status');
  }
};

// In your migration file:
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop any existing constraints on the amenities column
    await queryInterface.changeColumn('rooms', 'amenities', {
      type: Sequelize.TEXT, // Change column type to TEXT
      allowNull: true,      // Set to allow null if necessary
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Rollback if needed (revert the column to its original state)
    await queryInterface.changeColumn('rooms', 'amenities', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('medical_policy', 'encrypted_id', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('medical_policy', 'encrypted_id', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};



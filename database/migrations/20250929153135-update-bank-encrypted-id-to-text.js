
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('bank', 'encrypted_id', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('bank', 'encrypted_id', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};

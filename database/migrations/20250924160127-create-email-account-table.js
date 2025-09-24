/* eslint-disable filenames/match-regex */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('email_account', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      public_id: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      email_1_username: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email_1_password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email_2_username: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email_2_password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email_3_username: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email_3_password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email_4_username: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email_4_password: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('email_account');
  },
};

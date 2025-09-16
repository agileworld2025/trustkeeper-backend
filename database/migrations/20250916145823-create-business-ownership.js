/* eslint-disable filenames/match-regex */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('business_ownerships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      public_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      business_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Name of the business',
      },
      business_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Type of business (LLC, Corporation, Partnership, etc.)',
      },
      ownership_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Percentage of ownership in the business',
      },
      business_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Estimated or current value of the business',
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: 'Currency of the business value',
        defaultValue: 'USD',
      },
      business_address: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Business address information',
      },
      registration_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Business registration or tax ID number',
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Country where business is registered',
      },
      business_documents: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of uploaded business documents (.pdf, .docx, etc.)',
      },
      photos: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of business photos',
      },
      encrypted_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Soft delete flag',
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: 'User who created the record',
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'User who last updated the record',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        comment: 'Record creation timestamp',
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        comment: 'Record last update timestamp',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('business_ownerships');
  },
};

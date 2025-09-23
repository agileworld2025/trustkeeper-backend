/* eslint-disable filenames/match-regex */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('document_sharings', {
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
      owner_user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: 'User who owns the document',
      },
      shared_with_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'User ID if shared with registered user',
      },
      shared_with_email: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Email address if shared with non-registered user',
      },
      relative_id: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'Reference to user_relation table if shared with relative',
      },
      document_type: {
        type: Sequelize.ENUM(
          'will_testament',
          'business_ownership',
          'real_estate',
          'mutual_fund',
          'stocks',
          'crypto',
          'fixed_deposit',
          'gold_details',
          'insurance',
          'lic',
          'medical_policy',
          'term_insurance',
          'credit_card',
          'loan_details',
          'tax_details',
          'vehicle',
          'power_attorney',
          'trust_details',
          'legal_advisor',
        ),
        allowNull: false,
        comment: 'Type of document being shared',
      },
      document_id: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: 'Public ID of the document being shared',
      },
      sharing_token: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        comment: 'Unique token for secure access',
      },
      access_level: {
        type: Sequelize.ENUM('read_only', 'view_only'),
        defaultValue: 'read_only',
        comment: 'Access level for the shared document',
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether the sharing is active',
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Expiration date for the sharing link',
      },
      last_accessed_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Last time the document was accessed',
      },
      access_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Number of times the document was accessed',
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Personal message from owner to recipient',
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: 'User who created the sharing record',
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'User who last updated the record',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        comment: 'Record creation timestamp',
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        comment: 'Record last update timestamp',
      },
    });

    // Add indexes for better performance
    await queryInterface.addIndex('document_sharings', [ 'owner_user_id' ]);
    await queryInterface.addIndex('document_sharings', [ 'shared_with_user_id' ]);
    await queryInterface.addIndex('document_sharings', [ 'shared_with_email' ]);
    await queryInterface.addIndex('document_sharings', [ 'document_type', 'document_id' ]);
    await queryInterface.addIndex('document_sharings', [ 'sharing_token' ]);
    await queryInterface.addIndex('document_sharings', [ 'is_active' ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('document_sharings');
  },
};

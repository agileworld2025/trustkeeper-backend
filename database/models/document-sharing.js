module.exports = (sequelize, DataTypes) => {
  const DocumentSharing = sequelize.define(
    'document_sharing',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      public_id: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      owner_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User who owns the document',
      },
      shared_with_user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'User ID if shared with registered user',
      },
      shared_with_email: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Email address if shared with non-registered user',
      },
      relative_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Reference to user_relation table if shared with relative',
      },
      document_type: {
        type: DataTypes.ENUM(
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
          'legal_advisor'
        ),
        allowNull: false,
        comment: 'Type of document being shared',
      },
      document_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Public ID of the document being shared',
      },
      sharing_token: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        comment: 'Unique token for secure access',
      },
      access_level: {
        type: DataTypes.ENUM('read_only', 'view_only'),
        defaultValue: 'read_only',
        comment: 'Access level for the shared document',
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether the sharing is active',
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expiration date for the sharing link',
      },
      last_accessed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last time the document was accessed',
      },
      access_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Number of times the document was accessed',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Personal message from owner to recipient',
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User who created the sharing record',
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'User who last updated the record',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Record creation timestamp',
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Record last update timestamp',
      },
    },
    {
      tableName: 'document_sharings',
      underscored: true,
      timestamps: true,
      comment: 'Document sharing information for relatives and contacts',
    },
  );

  // Define associations
  DocumentSharing.associate = (models) => {
    // Association with User (owner)
    DocumentSharing.belongsTo(models.user, {
      foreignKey: 'owner_user_id',
      as: 'owner'
    });

    // Association with User (shared with user)
    DocumentSharing.belongsTo(models.user, {
      foreignKey: 'shared_with_user_id',
      as: 'sharedWithUser'
    });

    // Association with UserRelation (relative)
    DocumentSharing.belongsTo(models.user_relation, {
      foreignKey: 'relative_id',
      as: 'relative'
    });
  };

  return DocumentSharing;
};

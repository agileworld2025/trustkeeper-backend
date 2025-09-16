/* eslint-disable filenames/match-regex */
module.exports = (sequelize, DataTypes) => {
  const BusinessOwnership = sequelize.define(
    'business_ownership',
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
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      business_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Name of the business',
      },
      business_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Type of business (LLC, Corporation, Partnership, etc.)',
      },
      ownership_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Percentage of ownership in the business',
      },
      business_value: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Estimated or current value of the business',
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'Currency of the business value',
        defaultValue: 'USD',
      },
      business_address: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Business address information',
      },
      registration_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Business registration or tax ID number',
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Country where business is registered',
      },
      business_documents: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of uploaded business documents (.pdf, .docx, etc.)',
      },
      photos: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of business photos',
      },
      encrypted_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Soft delete flag',
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User who created the record',
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
      tableName: 'business_ownerships',
      underscored: true,
      timestamps: true,
      comment: 'Business ownership information as per UI screen',
    },
  );

  return BusinessOwnership;
};

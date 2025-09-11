/* eslint-disable filenames/match-regex */
module.exports = (sequelize, DataTypes) => {
  const RealEstateRecords = sequelize.define(
    'real_estate_records',
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
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      lease_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      photos: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      documents: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'USD',
      },
      property_value: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      insurance_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      mortgage_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ownership_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      address_line1: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'real_estate_records',
      underscored: true,
    },
  );

  return RealEstateRecords;
};

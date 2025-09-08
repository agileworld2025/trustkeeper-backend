/* eslint-disable filenames/match-regex */
module.exports = (sequelize, DataTypes) => {
  const TaxDetails = sequelize.define(
    'tax_details',
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
      tax_id_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_filing_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      filing_status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tax_consultant: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tax_documents: {
        type: DataTypes.JSON,
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
        allowNull: false,
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
      tableName: 'tax_details',
      underscored: true,
    },
  );

  return TaxDetails;
};

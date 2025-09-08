/* eslint-disable filenames/match-regex */
module.exports = (sequelize, DataTypes) => {
  const PowerAttorney = sequelize.define(
    'power_attorney',
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
      financial_power_of_attorney: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      authorized_persons: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      safe_storage: {
        type: DataTypes.TEXT,
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
      tableName: 'power_attorney',
      underscored: true,
    },
  );

  return PowerAttorney;
};

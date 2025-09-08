/* eslint-disable filenames/match-regex */
module.exports = (sequelize, DataTypes) => {
  const WillTestament = sequelize.define(
    'will_testament',
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
      executor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      beneficiaries: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      assets_distribution: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      safe_storage: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      tableName: 'will_testament',
      underscored: true,
    },
  );

  return WillTestament;
};

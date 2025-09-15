// models/gold.js
module.exports = (sequelize, DataTypes) => {
  const GoldDetail = sequelize.define(
    'gold_details',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      public_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      locker_details: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      service_provider: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      document_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      value: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      tableName: 'gold_details',
      timestamps: false,
      underscored: true,
    },
  );

  return GoldDetail;
};

module.exports = (sequelize, DataTypes) => {
  const TrustDocuments = sequelize.define(
    'trust_details',
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
      trust_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trust_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trustees: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      trust_beneficiaries: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      assets_in_trust: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      distribution_rules: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      trust_purpose: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      date_of_creation: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
      tableName: 'trust_details',
      underscored: true,
    },
  );

  return TrustDocuments;
};

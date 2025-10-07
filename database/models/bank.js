module.exports = (sequelize, DataTypes) => {
  const Bank = sequelize.define(
    'bank',
    {
      public_id: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      encrypted_id: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      account_number: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      account_holder: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      account_type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      bank_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ifsc_code: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      branch: {
        type: DataTypes.TEXT,
      },
      phone_number: {
        type: DataTypes.TEXT,
      },
      country: {
        type: DataTypes.TEXT,
      },
      currency: {
        type: DataTypes.TEXT,
        defaultValue: 'US Dollar',
      },
      document_path: {
        type: DataTypes.TEXT,
      },
      created_by: { type: DataTypes.UUID },
      updated_by: { type: DataTypes.UUID },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    },
  );

  return Bank;
};

module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define(
    'transactions',
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_by: { type: DataTypes.UUID },
      updated_by: { type: DataTypes.UUID },
    },
    {
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    },
  );

  return Transactions;
};

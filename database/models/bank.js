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
        type: DataTypes.STRING,
        allowNull: false,
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

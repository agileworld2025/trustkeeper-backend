module.exports = (sequelize, DataTypes) => {
  const UserRelation = sequelize.define(
    'user_relation',
    {
      public_id: { type: DataTypes.UUID, unique: true, allowNull: false },
      user_id: { type: DataTypes.UUID, allowNull: false },
      relative_of: { type: DataTypes.UUID, allowNull: false },
      relation_type: { type: DataTypes.STRING },
      name: { type: DataTypes.STRING },
      mobile_number: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      pincode: { type: DataTypes.STRING },
      address_line_1: { type: DataTypes.STRING },
      address_line_2: { type: DataTypes.STRING },
      created_by: { type: DataTypes.STRING },
      updated_by: { type: DataTypes.STRING },
    },
    {
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    },
  );

  return UserRelation;
};

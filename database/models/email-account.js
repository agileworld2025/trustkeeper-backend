/* eslint-disable filenames/match-regex */
module.exports = (sequelize, DataTypes) => {
  const EmailAccount = sequelize.define(
    'email_account',
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
      email_1_username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email_1_password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email_2_username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email_2_password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email_3_username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email_3_password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email_4_username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email_4_password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
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
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'email_account',
      underscored: true,
    },
  );

  return EmailAccount;
};

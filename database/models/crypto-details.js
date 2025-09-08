// eslint-disable-next-line filenames/match-regex
module.exports = (sequelize, DataTypes) => {
  const cryptoDetails = sequelize.define(
    'cryptocurrency_details',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      wallet_details: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      private_keys: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      exchange_accounts: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      investment_history: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
      },
      updated_by: {
        type: DataTypes.UUID,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        default: false,
      },
    },
    {
      tableName: 'cryptocurrency_details',
      underscored: true,
      timestamps: false,
    },
  );

  return cryptoDetails;
};

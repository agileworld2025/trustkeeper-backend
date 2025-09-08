// eslint-disable-next-line filenames/match-regex
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('cryptocurrency_details', {
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
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      default: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('cryptocurrency_details'),
};

// eslint-disable-next-line filenames/match-regex
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('stockMarketDetails', {
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
    brokerage_account_details: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    demat_account_information: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock_holdings_with_purchase_price: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    current_value: {
      type: DataTypes.DECIMAL(15, 2),
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
  }),
  down: (queryInterface) => queryInterface.dropTable('stockMarketDetails'),

};

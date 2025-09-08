/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('mutualFunds', {
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
    fund_house: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    investment_type: {
      type: DataTypes.ENUM('SIP', 'Lumpsum'),
      allowNull: false,
    },
    folio_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sip_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    frequency: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'annually'),
      allowNull: false,
    },
    maturity_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
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

  down: (queryInterface) => queryInterface.dropTable('mutualFunds'),
};

/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('credit_card', {
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
    card_number: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    card_holder_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    bank_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    upload_credit_card: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expiry_date: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    branch: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    available_balance: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
    },
    updated_by: {
      type: DataTypes.UUID,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

  down: (queryInterface) => queryInterface.dropTable('credit_card'),
};

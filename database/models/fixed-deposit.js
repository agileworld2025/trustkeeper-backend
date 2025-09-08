// eslint-disable-next-line filenames/match-regex
module.exports = (sequelize, DataTypes) => {
  const cryptoDetails = sequelize.define(
    'fixed_deposits',
    {
      public_id: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fd_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      maturity_date: {
        type: DataTypes.DATE,
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
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      institution_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      nominee_information: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
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

    },
    {
      tableName: 'fixed_deposits',
      underscored: true,
      timestamps: false,
    },
  );

  return cryptoDetails;
};

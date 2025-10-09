/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('streaming_services', {
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
    netflix_username: { type: DataTypes.TEXT, allowNull: true },
    netflix_password: { type: DataTypes.TEXT, allowNull: true },
    amazon_prime_username: { type: DataTypes.TEXT, allowNull: true },
    amazon_prime_password: { type: DataTypes.TEXT, allowNull: true },
    streaming_provider_username: { type: DataTypes.TEXT, allowNull: true },
    streaming_provider_password: { type: DataTypes.TEXT, allowNull: true },
    streaming_provider_2_username: { type: DataTypes.TEXT, allowNull: true },
    streaming_provider_2_password: { type: DataTypes.TEXT, allowNull: true },
    streaming_provider_3_username: { type: DataTypes.TEXT, allowNull: true },
    streaming_provider_3_password: { type: DataTypes.TEXT, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    created_by: { type: DataTypes.UUID, allowNull: false },
    updated_by: { type: DataTypes.UUID, allowNull: false },
    created_at: { allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }),

  down: (queryInterface) => queryInterface.dropTable('streaming_services'),
};

/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('social_media', {
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
    facebook_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    x_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    x_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

  down: (queryInterface) => queryInterface.dropTable('social_media'),
};

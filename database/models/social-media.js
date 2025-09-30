/* eslint-disable filenames/match-regex */
module.exports = (sequelize, DataTypes) => {
  const SocialMedia = sequelize.define(
    'social_media',
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
      facebook_username: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      facebook_password: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instagram_username: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instagram_password: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      linkedin_username: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      linkedin_password: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      x_username: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      x_password: {
        type: DataTypes.TEXT,
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
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'social_media',
      underscored: true,
    },
  );

  return SocialMedia;
};

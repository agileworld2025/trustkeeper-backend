/* eslint-disable filenames/match-regex */
module.exports = (sequelize, DataTypes) => {
  const CloudStorage = sequelize.define(
    'cloud_storage',
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
      google_drive_username: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      google_drive_password: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      onedrive_username: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      onedrive_password: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icloud_username: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icloud_password: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dropbox_username: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dropbox_password: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cloud_storage_username_1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cloud_storage_password_1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cloud_storage_username_2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cloud_storage_password_2: {
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
      tableName: 'cloud_storage',
      underscored: true,
    },
  );

  return CloudStorage;
};

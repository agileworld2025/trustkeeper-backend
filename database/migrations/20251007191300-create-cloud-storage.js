/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('cloud_storage', {
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
    google_drive_username: { type: DataTypes.STRING, allowNull: true },
    google_drive_password: { type: DataTypes.STRING, allowNull: true },
    onedrive_username: { type: DataTypes.STRING, allowNull: true },
    onedrive_password: { type: DataTypes.STRING, allowNull: true },
    icloud_username: { type: DataTypes.STRING, allowNull: true },
    icloud_password: { type: DataTypes.STRING, allowNull: true },
    dropbox_username: { type: DataTypes.STRING, allowNull: true },
    dropbox_password: { type: DataTypes.STRING, allowNull: true },
    cloud_storage_username_1: { type: DataTypes.STRING, allowNull: true },
    cloud_storage_password_1: { type: DataTypes.STRING, allowNull: true },
    cloud_storage_username_2: { type: DataTypes.STRING, allowNull: true },
    cloud_storage_password_2: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    created_by: { type: DataTypes.UUID, allowNull: false },
    updated_by: { type: DataTypes.UUID, allowNull: false },
    created_at: { allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }),

  down: (queryInterface) => queryInterface.dropTable('cloud_storage'),
};



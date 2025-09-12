/* eslint-disable filenames/match-regex */
module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    'vehicle',
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
      vehicle_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Type of vehicle (car, motorcycle, truck, etc.)',
      },
      ownership_details: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Ownership information',
      },
      value: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Estimated or current value of the vehicle',
      },
      insurance_details: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Insurance policy details and information',
      },
      lease_details: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Lease information if applicable',
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Country where vehicle is registered',
      },
      documents: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of uploaded vehicle documents (.pdf, .docx, etc.)',
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Soft delete flag',
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User who created the record',
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'User who last updated the record',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Record creation timestamp',
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Record last update timestamp',
      },
    },
    {
      tableName: 'vehicles',
      underscored: true,
      timestamps: true,
      comment: 'Simplified vehicle information as per UI screen',
    },
  );

  return Vehicle;
};

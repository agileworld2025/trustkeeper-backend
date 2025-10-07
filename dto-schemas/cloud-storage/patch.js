const patch = {
  title: 'Patch Cloud Storage Details',
  description: 'Defines the structure for HTTP PATCH request body',
  type: 'object',
  properties: {
    publicId: { type: 'string', format: 'uuid' },
    googleDriveUsername: { type: 'string' },
    googleDrivePassword: { type: 'string' },
    onedriveUsername: { type: 'string' },
    onedrivePassword: { type: 'string' },
    icloudUsername: { type: 'string' },
    icloudPassword: { type: 'string' },
    dropboxUsername: { type: 'string' },
    dropboxPassword: { type: 'string' },
    cloudStorageUsername1: { type: 'string' },
    cloudStoragePassword1: { type: 'string' },
    cloudStorageUsername2: { type: 'string' },
    cloudStoragePassword2: { type: 'string' },
    country: { type: 'string' },
    updatedBy: { type: 'string', format: 'uuid' },
  },
  required: ['publicId', 'updatedBy'],
  additionalProperties: false,
};

module.exports = patch;



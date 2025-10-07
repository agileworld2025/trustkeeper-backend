const save = {
  title: 'Save Cloud Storage Details',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
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
    userId: { type: 'string', format: 'uuid' },
  },
  required: [],
  additionalProperties: false,
};

module.exports = save;



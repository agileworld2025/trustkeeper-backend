const patch = {
  title: 'Patch Streaming Services Details',
  description: 'Defines the structure for HTTP PATCH request body',
  type: 'object',
  properties: {
    publicId: { type: 'string', format: 'uuid' },
    netflixUsername: { type: 'string' },
    netflixPassword: { type: 'string' },
    amazonPrimeUsername: { type: 'string' },
    amazonPrimePassword: { type: 'string' },
    streamingProviderUsername: { type: 'string' },
    streamingProviderPassword: { type: 'string' },
    streamingProvider2Username: { type: 'string' },
    streamingProvider2Password: { type: 'string' },
    streamingProvider3Username: { type: 'string' },
    streamingProvider3Password: { type: 'string' },
    country: { type: 'string' },
    updatedBy: { type: 'string', format: 'uuid' },
  },
  required: ['publicId', 'updatedBy'],
  additionalProperties: false,
};

module.exports = patch;

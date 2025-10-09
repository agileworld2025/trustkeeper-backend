const save = {
  title: 'Save Streaming Services Details',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
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
    userId: { type: 'string', format: 'uuid' },
  },
  required: [],
  additionalProperties: false,
};

module.exports = save;

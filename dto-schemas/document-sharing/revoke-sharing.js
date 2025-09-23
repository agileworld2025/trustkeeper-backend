const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const addErrors = require('ajv-errors');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const schema = {
  type: 'object',
  properties: {
    sharingId: {
      type: 'string',
      format: 'uuid',
      errorMessage: 'Sharing ID must be a valid UUID'
    },
    token: {
      type: 'string',
      minLength: 32,
      errorMessage: 'Token must be at least 32 characters long'
    }
  },
  anyOf: [
    { required: ['sharingId'] },
    { required: ['token'] }
  ],
  additionalProperties: false,
  errorMessage: {
    anyOf: 'Either sharingId or token must be provided'
  }
};

const validate = ajv.compile(schema);

module.exports = validate;

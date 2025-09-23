const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const addErrors = require('ajv-errors');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const schema = {
  type: 'object',
  properties: {
    token: {
      type: 'string',
      minLength: 32,
      errorMessage: 'Token must be at least 32 characters long'
    }
  },
  required: ['token'],
  additionalProperties: false,
  errorMessage: {
    required: {
      token: 'Sharing token is required'
    }
  }
};

const validate = ajv.compile(schema);

module.exports = validate;

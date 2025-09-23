const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const addErrors = require('ajv-errors');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const schema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      errorMessage: 'Email must be a valid email address'
    }
  },
  required: ['email'],
  additionalProperties: false,
  errorMessage: {
    required: {
      email: 'Email is required'
    }
  }
};

const validate = ajv.compile(schema);

module.exports = validate;

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const addErrors = require('ajv-errors');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const schema = {
  type: 'object',
  properties: {
    documentType: {
      type: 'string',
      enum: [
        'will_testament',
        'business_ownership',
        'real_estate',
        'mutual_fund',
        'stocks',
        'crypto',
        'fixed_deposit',
        'gold_details',
        'insurance',
        'lic',
        'medical_policy',
        'term_insurance',
        'credit_card',
        'loan_details',
        'tax_details',
        'vehicle',
        'power_attorney',
        'trust_details',
        'legal_advisor'
      ],
      errorMessage: 'Invalid document type'
    },
    page: {
      type: 'integer',
      minimum: 1,
      default: 1,
      errorMessage: 'Page must be a positive integer'
    },
    limit: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      default: 10,
      errorMessage: 'Limit must be between 1 and 100'
    },
    status: {
      type: 'string',
      enum: ['active', 'expired', 'revoked', 'all'],
      default: 'active',
      errorMessage: 'Status must be active, expired, revoked, or all'
    }
  },
  additionalProperties: false
};

const validate = ajv.compile(schema);

module.exports = validate;

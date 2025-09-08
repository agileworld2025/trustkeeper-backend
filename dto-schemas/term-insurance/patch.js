const patch = {
  title: 'patch medical Policy',
  description: 'Defines the structure for HTTP patch request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
    policyNumber: {
      type: 'string',
      description: 'Policy Number of the user’s medical Policy',
    },
    insuranseHoldername: {
      type: 'string',
      description: 'insuranse Holder name of the medical Policy',
    },
    dateOfCommence: {
      type: 'string',
      description: 'The date when the policy commenced (format: YYYY-MM-DD)',
    },
    premiumAmount: {
      type: 'string',
      description: 'The premium Amount to be received on policy maturity',
    },
    dateOfMaturity: {
      type: 'string',
      description: 'The date when the policy will mature (format: YYYY-MM-DD)',
    },
    coverAmount: {
      type: 'string',
      description: 'The cover Amount on policy',
    },
    frequency: {
      type: 'string',
      description: 'The frequency of the premium payment (e.g., monthly, quarterly, yearly)',
    },
    renewal: {
      type: 'string',
      description: 'The renewal date for the policy (format: YYYY-MM-DD)',
    },
    provider: {
      type: 'string',
      description: 'The policy provider',
    },
    updatedBy: {
      type: 'string',
      description: 'userId',
      format: 'uuid',
    },
  },
  required: [ 'publicId', 'updatedBy' ],
  additionalProperties: false,
};

module.exports = patch;

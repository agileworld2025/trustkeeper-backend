const patch = {
  title: 'patch lic',
  description: 'Defines the structure for HTTP patch request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
    policyNumber: {
      type: 'string',
      description: 'The unique number assigned to the policy',
    },
    policyHolderName: {
      type: 'string',
      description: 'The name of the policyholder',
    },
    dateOfCommence: {
      type: 'string',
      description: 'The date when the policy commenced (format: YYYY-MM-DD)',
    },
    premiumAmount: {
      type: 'string',
      description: 'The premium amount paid for the policy',
    },
    dateOfMaturity: {
      type: 'string',
      description: 'The date when the policy will mature (format: YYYY-MM-DD)',
    },
    sum_assuraed: {
      type: 'string',
      description: 'The sum assured by the policy',
    },
    bonusAssuraed: {
      type: 'string',
      description: 'The bonus assured in the policy',
    },
    frequency: {
      type: 'string',
      description: 'The frequency of the premium payment (e.g., monthly, quarterly, yearly)',
    },
    nextDueDate: {
      type: 'string',
      description: 'The next due date for the premium payment (format: YYYY-MM-DD)',
    },
    amount_on_maturity: {
      type: 'string',
      description: 'The amount to be received on policy maturity',
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

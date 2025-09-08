/* eslint-disable no-console */
const TransactionsService = require('../service/transactions');
const Validator = require('../utils/validator');
const { save: saveSchema } = require('../dto-schemas/transactions');

const save = async (req, res) => {
  try {
    const { body, auth: { userId, customerId } } = req;

    if (customerId) {
      return res.status(400).json({ status: 'error', message: 'Relative cannot save the customer transactions' });
    }

    const { errors, data } = Validator.isSchemaValid({ data: { ...body, userId }, schema: saveSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { errors: err, doc } = await TransactionsService.save(data);

    if (doc) {
      const { publicId } = doc;

      res.setHeader('public-id', publicId);

      res.setHeader('message', 'successfully saved.');

      return res.status(201).json({ status: 'success', message: 'successfully saved.' });
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const { auth: { userId, customerId } } = req;

    const { count, doc } = await TransactionsService.getAll({ userId, customerId });

    const transformedData = doc.map((item) => (
      {
        publicId: item.publicId,
        userId: item.userId,
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        decryptedData: { ...item.decryptedData },
      }));

    res.setHeader('x-coreplatform-paging-limit', count);
    res.setHeader('x-coreplatform-total-records', count);

    return res.status(200).json(transformedData);
  } catch (error) {
    console.error('Error in getAll:', error);

    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = { save, getAll };

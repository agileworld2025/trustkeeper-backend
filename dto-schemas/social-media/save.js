const Joi = require('joi');

const save = Joi.object({
  facebookUsername: Joi.string().allow('', null).optional(),
  facebookPassword: Joi.string().allow('', null).optional(),
  instagramUsername: Joi.string().allow('', null).optional(),
  instagramPassword: Joi.string().allow('', null).optional(),
  linkedinUsername: Joi.string().allow('', null).optional(),
  linkedinPassword: Joi.string().allow('', null).optional(),
  xUsername: Joi.string().allow('', null).optional(),
  xPassword: Joi.string().allow('', null).optional(),
  country: Joi.string().allow('', null).optional(),
});

module.exports = save;

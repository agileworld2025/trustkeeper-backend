/* eslint-disable no-console */
const { v1: uuidV1 } = require('uuid');
const { user_relation: UserRelationModel } = require('../database');
const { convertSnakeToCamel } = require('../utils/helper');

// Add family member to sharing
const addFamilyMember = async (payload, userId) => {
  try {
    const {
      name,
      email,
      phone,
      alternatePhone,
      countryCode = '+1',
      alternateCountryCode = '+1',
      address,
      relationType,
      accessLevel = 'view_only',
    } = payload;

    // Validate required fields
    if (!name || !email || !relationType) {
      return {
        errors: [ {
          name: 'addFamilyMember',
          message: 'Name, email, and relation type are required',
        } ],
      };
    }

    // Create or update user relation
    const [ userRelation, created ] = await UserRelationModel.findOrCreate({
      where: {
        user_id: userId,
        email,
      },
      defaults: {
        public_id: uuidV1(),
        name,
        email,
        mobile_number: phone || null,
        alternate_phone: alternatePhone || null,
        country_code: countryCode,
        alternate_country_code: alternateCountryCode,
        address_line_1: address || null,
        relation_type: relationType,
        access_level: accessLevel,
        is_active: true,
        // Set relative_of to the same user for now
        relative_of: userId,
      },
    });

    if (!created) {
      // Update existing relation
      await userRelation.update({
        name,
        mobile_number: phone || null,
        alternate_phone: alternatePhone || null,
        country_code: countryCode,
        alternate_country_code: alternateCountryCode,
        address_line_1: address || null,
        relation_type: relationType,
        access_level: accessLevel,
        is_active: true,
      });
    }

    return {
      doc: {
        familyMember: convertSnakeToCamel(userRelation.dataValues),
        isNew: created,
        message: created ? 'Family member added successfully' : 'Family member updated successfully',
      },
    };
  } catch (error) {
    console.error('Add family member error:', error);

    return {
      errors: [ {
        name: 'addFamilyMember',
        message: 'An error occurred while adding family member',
      } ],
    };
  }
};

module.exports = {
  addFamilyMember,
};

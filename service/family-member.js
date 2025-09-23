/* eslint-disable no-console */
const { v1: uuidV1 } = require('uuid');
const { user_relation: UserRelationModel } = require('../database');
const { convertSnakeToCamel } = require('../utils/helper');

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

    const relationData = {
      name,
      email,
      mobile_number: phone,
      alternate_phone: alternatePhone,
      country_code: countryCode,
      alternate_country_code: alternateCountryCode,
      address_line_1: address,
      relation_type: relationType,
      access_level: accessLevel,
      is_active: true,
      relative_of: userId,
    };

    const [ userRelation, created ] = await UserRelationModel.findOrCreate({
      where: {
        user_id: userId,
        email,
      },
      defaults: {
        public_id: uuidV1(),
        ...relationData,
      },
    });

    if (!created) {
      await userRelation.update(relationData);
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

const getFamilyMembers = async (userId) => {
  try {
    const familyMembers = await UserRelationModel.findAll({
      where: {
        user_id: userId,
        is_active: true,
      },
      order: [ [ 'created_at', 'DESC' ] ],
    });

    const formattedFamilyMembers = familyMembers.map((member) => convertSnakeToCamel(member.dataValues));

    return {
      familyMembers: formattedFamilyMembers,
      count: formattedFamilyMembers.length,
    };
  } catch (error) {
    console.error('Get family members error:', error);

    return {
      errors: [ {
        name: 'getFamilyMembers',
        message: 'An error occurred while fetching family members',
      } ],
    };
  }
};

module.exports = {
  addFamilyMember,
  getFamilyMembers,
};

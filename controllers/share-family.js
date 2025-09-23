
const FamilyMemberService = require('../service/family-member');
const { addFamilyMember: addFamilyMemberSchema } = require('../dto-schemas/document-sharing');

const addFamilyMember = async (req, res) => {
  try {
    const { userId } = req.auth;

    // Validate the request body first (without userId)
    const isValid = addFamilyMemberSchema(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors: addFamilyMemberSchema.errors,
      });
    }

    const result = await FamilyMemberService.addFamilyMember(req.body, userId);

    if (result.errors) {
      return res.status(400).json({
        success: false,
        errors: result.errors,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.doc,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Add family member controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getFamilyMembers = async (req, res) => {
  try {
    const { userId } = req.auth;
    const result = await FamilyMemberService.getFamilyMembers(userId);

    if (result.errors) {
      return res.status(400).json({
        success: false,
        errors: result.errors,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.familyMembers,
      count: result.count,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Get family members controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  addFamilyMember,
  getFamilyMembers,
};

/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('user_relation', 'mobile_number', { type: DataTypes.STRING }, { transaction }),
    queryInterface.addColumn('user_relation', 'country', { type: DataTypes.STRING }, { transaction }),
    queryInterface.addColumn('user_relation', 'state', { type: DataTypes.STRING }, { transaction }),
    queryInterface.addColumn('user_relation', 'pincode', { type: DataTypes.STRING }, { transaction }),
    queryInterface.addColumn('user_relation', 'address_line_1', { type: DataTypes.STRING }, { transaction }),
    queryInterface.addColumn('user_relation', 'address_line_2', { type: DataTypes.STRING }, { transaction }),
  ])),

  down: (queryInterface) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('user_relation', 'mobile_number', { transaction }),
    queryInterface.removeColumn('user_relation', 'country', { transaction }),
    queryInterface.removeColumn('user_relation', 'state', { transaction }),
    queryInterface.removeColumn('user_relation', 'pincode', { transaction }),
    queryInterface.removeColumn('user_relation', 'address_line_1', { transaction }),
    queryInterface.removeColumn('user_relation', 'address_line_2', { transaction }),
  ])),
};

/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('user_relation', 'alternate_phone', { type: DataTypes.STRING }, { transaction }),
    queryInterface.addColumn('user_relation', 'country_code', { type: DataTypes.STRING, defaultValue: '+1' }, { transaction }),
    queryInterface.addColumn('user_relation', 'alternate_country_code', { type: DataTypes.STRING, defaultValue: '+1' }, { transaction }),
  ])),

  down: (queryInterface) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('user_relation', 'alternate_phone', { transaction }),
    queryInterface.removeColumn('user_relation', 'country_code', { transaction }),
    queryInterface.removeColumn('user_relation', 'alternate_country_code', { transaction }),
  ])),
};

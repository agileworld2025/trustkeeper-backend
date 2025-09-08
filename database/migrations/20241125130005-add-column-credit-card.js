/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('credit_card', 'is_deleted', { type: DataTypes.BOOLEAN, defaultValue: false }, { transaction }),
  ])),

  down: (queryInterface) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('credit_card', 'is_deleted', { transaction }),
  ])),
};

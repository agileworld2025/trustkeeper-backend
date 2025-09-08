/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('medical_policy', 'is_deleted', { type: DataTypes.BOOLEAN, defaultValue: false }, { transaction }),
  ])),

  down: (queryInterface) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('medical_policy', 'is_deleted', { transaction }),
  ])),
};

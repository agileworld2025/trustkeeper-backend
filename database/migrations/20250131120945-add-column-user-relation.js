/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('user_relation', 'name', { type: DataTypes.STRING }, { transaction }),
  ])),

  down: (queryInterface) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('user_relation', 'name', { transaction }),
  ])),
};

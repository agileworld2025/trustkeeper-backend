/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('user_relation', 'email', { type: DataTypes.STRING }, { transaction }),
    queryInterface.addColumn('user_relation', 'access_level', { type: DataTypes.STRING, defaultValue: 'view_only' }, { transaction }),
    queryInterface.addColumn('user_relation', 'is_active', { type: DataTypes.BOOLEAN, defaultValue: true }, { transaction }),
  ])),

  down: (queryInterface) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('user_relation', 'email', { transaction }),
    queryInterface.removeColumn('user_relation', 'access_level', { transaction }),
    queryInterface.removeColumn('user_relation', 'is_active', { transaction }),
  ])),
};

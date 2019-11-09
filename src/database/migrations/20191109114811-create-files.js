module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('files', 'name', {
        type: Sequelize.STRING,
        allowNull: false
      });
      await queryInterface.addColumn('files', 'path', {
        type: Sequelize.STRING,
        allowNull: false
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async queryInterface => {
    try {
      await queryInterface.removeColumn('files', 'name');
      await queryInterface.removeColumn('files', 'path');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

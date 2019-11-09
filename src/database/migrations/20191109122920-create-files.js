module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('files', 'created_at', {
        type: Sequelize.DATE,
        allowNull: false
      });
      await queryInterface.addColumn('files', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async queryInterface => {
    try {
      await queryInterface.removeColumn('files', 'created_at');
      await queryInterface.removeColumn('files', 'updated_at');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

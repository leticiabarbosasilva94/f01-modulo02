module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.changeColumn('files', 'path', {
        type: Sequelize.DATE,
        allowNull: false,
        unique: true
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.changeColumn('files', 'path', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

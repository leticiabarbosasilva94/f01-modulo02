import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: {
              msg: 'File name cannot be empty'
            }
          }
        },
        path: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: {
              msg: 'Path cannot be empty'
            }
          }
        }
      },
      {
        sequelize
      }
    );

    return this;
  }
}

module.exports = File;

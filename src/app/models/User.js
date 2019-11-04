import Sequelize, { Model } from 'sequelize';
import bcryptjs from 'bcryptjs';

export default class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          validate: {
            len: {
              msg: 'Name must have between 3 and 255 characters.',
              args: [3, 255]
            },
            notEmpty: {
              msg: 'Name is required.'
            }
          }
        },
        email: {
          type: Sequelize.STRING,
          unique: {
            msg: 'E-mail has already been taken.'
          },
          validate: {
            isEmail: {
              msg: 'E-mail is invalid.'
            }
          }
        },
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN
      },
      {
        sequelize
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcryptjs.hash(user.password, 8);
      }
    });
  }
}

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
        password: {
          type: Sequelize.VIRTUAL,
          validate: {
            len: {
              args: [6, 50],
              msg: 'Password must have between 6 and 50 characters.'
            }
          }
        },
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

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  async passwordIsValid(password) {
    return bcryptjs.compare(password, this.password_hash);
  }
}

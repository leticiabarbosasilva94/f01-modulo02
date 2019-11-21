import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: {
          type: Sequelize.DATE,
          defaultValue: '',
          validate: {
            isDate: {
              msg: 'date: Invalid date'
            }
          }
        },
        canceled_at: {
          type: Sequelize.DATE,
          defaultValue: null,
          validate: {
            isDate: {
              msg: 'canceled_at: Invalid date'
            }
          }
        },
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          }
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          }
        }
      },
      {
        sequelize
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'provider_id',
      as: 'provider'
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

export default Appointment;

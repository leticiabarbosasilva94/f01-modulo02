import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  constructor() {
    this.index = this.index.bind(this);
  }

  async checkUserProvider(req) {
    const userProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true
      },
      limit: 1
    });

    return userProvider;
  }

  async index(req, res) {
    const userProvider = await this.checkUserProvider(req);

    if (!userProvider) {
      return res.status(401).json({
        errors: ["You're not a provider."]
      });
    }

    const { date } = req.query;

    if (!new Date(date).getTime()) {
      return res.status(401).json({
        errors: ['Invalid date']
      });
    }

    const appointments = await Appointment.findAll({
      where: {
        canceled_at: null,
        provider_id: req.userId,
        date: {
          [Op.between]: [startOfDay(parseISO(date)), endOfDay(parseISO(date))]
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ],
      order: [['date', 'DESC']]
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();

import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
// import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

// import Mail from '../../lib/Mail';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const paginationLimit = 20;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null
        // date: {
        //   [Op.gte]: new Date()
        // }
      },
      limit: paginationLimit,
      offset: (page - 1) * paginationLimit,
      order: [['id', 'DESC']],
      attributes: ['id', 'date', 'past', 'cancelable'],

      include: {
        model: User,
        as: 'provider',
        attributes: ['id', 'name'],

        include: {
          model: File,
          as: 'avatar',
          attributes: ['path', 'url']
        }
      }
    });

    res.json(appointments);
  }
  // async show(req, res) {}

  async store(req, res) {
    try {
      const { date, provider_id } = req.body;

      if (!date || !provider_id || !req.userId) {
        return res.status(400).json({
          errors: ['Missing values: send date, provider_id and user_id']
        });
      }

      const user = await User.findOne({
        where: {
          id: req.userId
        }
      });

      if (!user) {
        return res.status(400).json({
          errors: ['Your user do not exists.']
        });
      }

      const isProvider = await User.findOne({
        where: {
          id: provider_id,
          provider: true
        }
      });

      if (!isProvider) {
        return res.status(400).json({
          errors: ['User must be a provider for you to make an appointment.']
        });
      }

      if (req.userId === provider_id) {
        return res.status(400).json({
          errors: ['Cannot make an appointment with yourself.']
        });
      }

      const data = { date, provider_id, user_id: req.userId };

      // Checking for past date
      const hourStart = startOfHour(parseISO(date));

      if (isBefore(hourStart, new Date())) {
        return res.status(400).json({
          errors: ['Date is in the past.']
        });
      }

      // Checking if user hast another appointment at the same time
      const hasAppointmentAtTime = await Appointment.findOne({
        where: {
          provider_id,
          canceled_at: null,
          user_id: data.user_id,
          date: hourStart
        }
      });

      if (hasAppointmentAtTime) {
        return res.status(400).json({
          errors: ['User has another appointment at the same time.']
        });
      }

      data.date = hourStart;
      const formatedDate = format(
        hourStart,
        "'dia' dd 'de' MMMM 'de' yyyy', às' H:mm'h'",
        { locale: pt }
      );

      const appointment = await Appointment.create(data);

      await Notification.create({
        content: `Novo agendamento de ${user.name} para ${formatedDate}`,
        user: provider_id
      });

      return res.json(appointment);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message)
      });
    }
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email']
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        }
      ]
    });

    if (!appointment) {
      return res.status(400).json({
        errors: ['Appointment do not exists']
      });
    }

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        errors: ['Permission denied']
      });
    }

    if (appointment.canceled_at) {
      return res.status(400).json({
        errors: ['Appointment canceled']
      });
    }

    const dateTwoHoursBefore = subHours(appointment.date, 2);
    const canCancel = isBefore(dateTwoHoursBefore, new Date());

    if (!canCancel) {
      return res.status(401).json({
        errors: ['You cannot cancel this appointment']
      });
    }

    appointment.canceled_at = new Date();
    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment
    });

    return res.json(appointment);
  }

  // async upate(req, res) {}
}

export default new AppointmentController();

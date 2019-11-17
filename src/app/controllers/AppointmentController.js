import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
  // async index(req, res) {}
  // async show(req, res) {}

  async store(req, res) {
    try {
      const { date, provider_id } = req.body;

      if (!date || !provider_id || !req.userId) {
        return res.status(400).json({
          errors: ['Missing values: send date, provider_id and user_id']
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

      const appointment = await Appointment.create(data);
      return res.json(appointment);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message)
      });
    }
  }

  // async upate(req, res) {}
  // async delete(req, res) {}
}

export default new AppointmentController();

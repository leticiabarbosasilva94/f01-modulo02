import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    let { date } = req.query;

    if (!date) {
      date = new Date().getTime();
    }

    date = Number(date);

    const dateFromTime = new Date(date);

    if (!dateFromTime.getTime()) {
      return res.status(400).json({
        errors: ['Invalid date']
      });
    }

    const appointments = await Appointment.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(dateFromTime), endOfDay(dateFromTime)]
        },
        canceled_at: null,
        provider_id: req.params.providerId
      },
      order: [['date', 'DESC']]
    });

    const setHours = (theDate, hour) => {
      theDate.setHours(hour);
      theDate.setMinutes(0);
      theDate.setSeconds(0);
      theDate.setMilliseconds(0);
      return theDate;
    };

    const startDate = new Date(dateFromTime.getTime());
    setHours(startDate, 8);

    const endDate = new Date(dateFromTime.getTime());
    setHours(endDate, 19);

    const arr = Array.from(new Array(24).keys());

    const dates = arr
      .map(el => {
        const nDate = new Date(date);
        setHours(nDate, el);

        return {
          time: nDate.toLocaleTimeString('pt-BR', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          }),
          date: nDate,
          available:
            !appointments.find(appointment => {
              return (
                String(new Date(appointment.date).toISOString()) ===
                String(nDate.toISOString())
              );
            }) && nDate > new Date(),
          nDate,
          t2: nDate.getTime()
        };
      })
      .filter(
        ap =>
          new Date(ap.date).getTime() >= startDate.getTime() &&
          new Date(ap.date).getTime() <= endDate.getTime()
      );

    return res.json(dates);
  }
}

export default new AvailableController();

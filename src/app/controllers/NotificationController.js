import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
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

    const notifications = await Notification.find({
      user: req.userId
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        read: true
      },
      {
        new: true
      }
    );

    return res.json(notification);
  }
}

export default new NotificationController();

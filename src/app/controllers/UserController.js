import User from '../models/User';
import File from '../models/File';

const isValidPassword = (password, confirmPassword) => {
  if (!password || !confirmPassword) {
    return false;
  }

  if (password !== confirmPassword) {
    return false;
  }

  return true;
};

const store = async (req, res) => {
  try {
    const {
      name = '',
      email = '',
      password = '',
      confirmPassword = '',
      provider = false
    } = req.body;

    if (!isValidPassword(password, confirmPassword)) {
      return res
        .status(401)
        .json({ errors: ["Password and confirm password don't match"] });
    }

    const user = await User.create({ name, email, password, provider });

    return res.json({
      name: user.name,
      password: user.password,
      email: user.email,
      provider: user.provider
    });
  } catch (e) {
    return res
      .status(400)
      .json({ errors: e.errors.map(error => error.message) });
  }
};

const update = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      oldPassword,
      confirmPassword,
      avatar_id
    } = req.body;

    if (!req.userId) {
      return res.status(400).json({ errors: 'User ID not provided.' });
    }

    if (password) {
      if (!isValidPassword(password, confirmPassword)) {
        return res
          .status(401)
          .json({ errors: ["Password and confirm password don't match"] });
      }
    }

    if (password && !oldPassword) {
      return res
        .status(400)
        .json({ errors: 'To change password, send the oldPassword.' });
    }

    if (!name && !email && !password && !oldPassword && !avatar_id) {
      return res.status(400).json({ errors: 'Nothing to change.' });
    }

    const user = await User.findByPk(req.userId);
    if (!user) return res.status(400).json({ errors: 'User do not exists.' });

    if (oldPassword && !(await user.passwordIsValid(oldPassword))) {
      return res.status(401).json({ errors: 'Invalid old password.' });
    }

    const userUpdated = await user.update({ name, email, password, avatar_id });

    const { avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }
      ]
    });

    return res.json({
      name: userUpdated.name,
      password: userUpdated.password,
      email: userUpdated.email,
      provider: userUpdated.provider,
      avatar
    });
  } catch (e) {
    return res
      .status(400)
      .json({ errors: e.errors.map(error => error.message) });
  }
};

// eslint-disable-next-line
const show = async (req, res) => {};
// eslint-disable-next-line
const remove = async (req, res) => {};
// eslint-disable-next-line
const index = async (req, res) => {};

export { store, show, update, remove, index };

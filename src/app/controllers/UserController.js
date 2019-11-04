import User from '../models/User';

const store = async (req, res) => {
  try {
    const { name = '', email = '', password = '', provider = false } = req.body;
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

// eslint-disable-next-line
const show = async (req, res) => {};
// eslint-disable-next-line
const update = async (req, res) => {};
// eslint-disable-next-line
const remove = async (req, res) => {};
// eslint-disable-next-line
const index = async (req, res) => {};

export { store, show, update, remove, index };

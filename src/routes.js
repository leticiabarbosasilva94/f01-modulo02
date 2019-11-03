import { Router } from 'express';
import User from './app/models/User';

const router = new Router();

router.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Letícia Barbosa Silva',
    email: 'leticiabarbosasilva94@gmail.com',
    password_hash: '31a6d5a45sd4a65sd4'
  });

  res.json(user);
});

export default router;

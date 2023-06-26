import express from 'express';
import * as auth from '../controllers/auth.controllers';
import { isAliveAccessToken } from '../middlewares/isAliveToken';
const router = express.Router();

router.post('/auth/signup', auth.signUp);
router.post('/auth/signin', auth.signIn);
router.post('/auth/signout', auth.signOut);
router.post('/auth/getUser', isAliveAccessToken, auth.getUser);

// router.put('/auth/:id', auth.updateUser);
// router.delete('/auth/:id', auth.deleteUser);

export default router;

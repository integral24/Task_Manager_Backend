import express from 'express';
import * as auth from '../controllers/auth.controllers';
const router = express.Router();

router.post('/auth/signup', auth.signUp);
router.post('/auth/signin', auth.signIn);
// router.post('/auth/signout', auth.signOut);
// router.put('/auth/:id', auth.updateUser);
// router.delete('/auth/:id', auth.deleteUser);

export default router;

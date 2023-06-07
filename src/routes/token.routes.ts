import express from 'express';
import { refreshTokenController } from '../controllers/token.controllers';
import { isAliveRefreshToken } from '../middlewares/isAliveToken';
const router = express.Router();

router.post('/refresh', isAliveRefreshToken, refreshTokenController);

export default router;

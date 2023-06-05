import express from 'express';
import { refreshTokenController } from '../controllers/token.controllers';
const router = express.Router();

router.post('/refresh', refreshTokenController);

export default router;

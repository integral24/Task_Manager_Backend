import express from "express";
import * as task from '../controllers/task.controllers';
import { isAliveAccessToken } from '../middlewares/isAliveToken';
const router = express.Router();

router.post('/task', isAliveAccessToken, task.createTask);
router.get('/task/', isAliveAccessToken, task.readAllTasks);
router.get('/task/:id', isAliveAccessToken, task.readOneTask);
router.put('/task/:id', isAliveAccessToken, task.updateTask);
router.delete('/task/:id', isAliveAccessToken, task.deleteTask);

export default router;

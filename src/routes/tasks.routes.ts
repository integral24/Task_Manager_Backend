import express from "express";
import * as task from '../controllers/task.controllers';
import { isAliveAccessToken } from '../middlewares/isAliveToken';
const router = express.Router();

router.post('/create', isAliveAccessToken, task.createTask);
router.post('/tasks/', isAliveAccessToken, task.readAllTasks);
router.post('/task/:id', isAliveAccessToken, task.readOneTask);
router.put('/task/:id', isAliveAccessToken, task.updateTask);
router.delete('/task/:id', isAliveAccessToken, task.deleteTask);

export default router;

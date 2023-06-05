import express from "express";
import * as task from '../controllers/task.controllers';
import { isAliveSuccessToken } from '../middlewares/isAliveToken';
const router = express.Router();

router.post('/task', isAliveSuccessToken, task.createTask);
router.get('/task/', task.readAllTasks);
router.get('/task/:id', task.readOneTask);
router.put('/task/:id', task.updateTask);
router.delete('/task/:id', task.deleteTask);

export default router;
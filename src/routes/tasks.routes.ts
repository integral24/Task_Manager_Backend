import express from "express";
import * as task from '../controllers/task.controllers';
import { isAliveSuccessToken } from '../middlewares/isAliveToken';
const router = express.Router();

router.post('/task', isAliveSuccessToken, task.createTask);
router.get('/task/', isAliveSuccessToken, task.readAllTasks);
router.get('/task/:id', isAliveSuccessToken, task.readOneTask);
router.put('/task/:id', isAliveSuccessToken, task.updateTask);
router.delete('/task/:id', isAliveSuccessToken, task.deleteTask);

export default router;

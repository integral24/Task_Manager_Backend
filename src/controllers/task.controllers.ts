import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../assets/db';
import { errors, messages } from '../assets/responses';

export interface IDecodeToken {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

interface ITask {
  id: number;
  title: string;
  description: string;
  done: number;
  createDate: string;
  type: string;
}
type typeOptions = 'Срочные' | 'Важные' | 'Обычные' | 'Все';

interface ISort {
  type: typeOptions;
  requestPage: number;
}
const getData = (data: any): ITask => data[0][0];

const getCurrentTasks = async (userId: number): Promise<ITask[] | undefined> => {
  try {
    const tasks = await pool.query(
      'SELECT `id`, `title`, `description`, `done`, `createDate`, `type` FROM `tasks` WHERE `userId` = ?',
      userId,
    );
    return tasks[0] as ITask[];
  } catch (err) {
    console.log(err);
  }
};

const sortingHandler = (tasks: ITask[], sort: ISort) => {
  if (tasks.length > 0) {
    const sortedTasks = tasks.reverse();
    return sortedTasks;
  } else return tasks;
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, done, type } = req.body.task;
    const sort = req.body.sort;
    console.log(sort);
    const { userId } = jwt.decode(req.headers.authorization?.split(' ')[1] || '', {}) as IDecodeToken;
    const newTask: any = await pool.query('INSERT INTO `tasks` SET ?', {
      userId,
      title,
      description,
      done,
      type,
    });

    const currentTasks = await getCurrentTasks(userId);
    if (currentTasks) {
      const tasks = sortingHandler(currentTasks, sort);
      res.json({
        tasks,
        message: messages.taskWasCreated,
      });
    } else {
      res.json({
        error: errors.insertError,
      });
    }
  } catch (err: unknown) {
    res.json(err);
  }
};

export const readAllTasks = async (req: Request, res: Response) => {
  try {
    const { userId } = jwt.decode(req.headers.authorization?.split(' ')[1] || '', {}) as IDecodeToken;
    const tasks = await pool.query(
      'SELECT `id`, `title`, `description`, `done`, `createDate`, `type` FROM `tasks` WHERE `userId` = ?',
      userId,
    );
    res.json(tasks[0]);
  } catch (err: unknown) {
    res.json(err);
  }
};

export const readOneTask = async (req: Request, res: Response) => {
  try {
    const { userId } = jwt.decode(req.headers.authorization?.split(' ')[1] || '', {}) as IDecodeToken;
    const id = req.params.id;
    const tasks = await pool.query(
      `'SELECT id, title, description, done, createDate, type FROM tasks WHERE id = ${id} AND userId = ${userId}'`.slice(
        1,
        -1,
      ),
    );
    res.json(tasks[0]);
  } catch (err: unknown) {
    res.json(err);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { userId } = jwt.decode(req.headers.authorization?.split(' ')[1] || '', {}) as IDecodeToken;
    const id = req.params.id;
    const { title, description, done, type } = req.body;
    const updatedTask: any = await pool.query('UPDATE `tasks` SET ? WHERE `id` = ? AND `userId` = ?', [
      {
        title,
        description,
        done,
        type,
      },
      id,
      userId,
    ]);

    if (updatedTask[0]?.changedRows === 1) {
      const task = await pool.query(
        `'SELECT id, title, description, done, createDate, type FROM tasks WHERE id = ${id} AND userId = ${userId}'`.slice(
          1,
          -1,
        ),
      );
      res.json(task[0]);
    } else
      res.json({
        error: errors.noChange,
      });
  } catch (err: unknown) {
    res.json(err);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { userId } = jwt.decode(req.headers.authorization?.split(' ')[1] || '', {}) as IDecodeToken;
    const id = req.params.id;
    const del: any = await pool.query(`'DELETE FROM tasks WHERE id = ${id} AND userId = ${userId}'`.slice(1, -1));

    if (del[0]?.affectedRows === 1) {
      res.json({
        id,
        message: messages.delTaskSuccess,
        delete: true,
      });
    } else {
      res.json({
        error: errors.delTaskError,
      });
    }
  } catch (err: unknown) {
    res.json(err);
  }
};

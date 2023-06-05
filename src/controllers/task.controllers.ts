import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../assets/db';

interface IDecodeToken {
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
const getData = (data: any): ITask => data[0][0];

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, done, type } = req.body;
    const { userId } = jwt.decode(req.headers.authorization?.split(' ')[1] || '', {}) as IDecodeToken;
    console.log(userId);
    const newTask: any = await pool.query('INSERT INTO `tasks` SET ?', {
      userId,
      title,
      description,
      done,
      type,
    });

    const id = newTask[0].insertId;
    if (id) {
      const data: any = await pool.query('SELECT * FROM `tasks` WHERE `id` = ?', id);
      res.json({
        id,
        title: getData(data).title,
        description: getData(data).description,
        done: getData(data).done,
        createDate: getData(data).createDate,
        type: getData(data).type,
      });
    } else res.json('Wrong insert');
  } catch (err: unknown) {
    res.json(err);
    console.log('createTask', err);
  }
};

//TODO: дописать функции ниже

export const readAllTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const tasks = await pool.query('SELECT * FROM `tasks` WHERE `userId` = ?', userId);
    res.json(tasks[0]);
  } catch (err: unknown) {
    res.json(err);
    console.log('readAllTasks', err);
  }
};

export const readOneTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const tasks = await pool.query('SELECT * FROM `tasks` WHERE `id` = ?', id);
    res.json(tasks[0]);
  } catch (err: unknown) {
    res.json(err);
    console.log('readOneTask', err);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { title, description, done, type } = req.body;
    const newTask = await pool.query('UPDATE `tasks` SET ? WHERE `id` = ?', [
      {
        title,
        description,
        done,
        type,
      },
      id,
    ]);
    res.json(newTask[0]);
  } catch (err: unknown) {
    res.json(err);
    console.log('updateTask', err);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const task = await pool.query('DELETE FROM `tasks` WHERE `id` = ?', id);
    res.json(task[0]);
  } catch (err: unknown) {
    res.json(err);
    console.log('deleteTask', err);
  }
};

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
    const { userId } = jwt.decode(
      req.headers.authorization?.split(' ')[1] || '',
      {},
    ) as IDecodeToken;
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
  }
};

export const readAllTasks = async (req: Request, res: Response) => {
  try {
    const { userId } = jwt.decode(
      req.headers.authorization?.split(' ')[1] || '',
      {},
    ) as IDecodeToken;
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
    const { userId } = jwt.decode(
      req.headers.authorization?.split(' ')[1] || '',
      {},
    ) as IDecodeToken;
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
    const { userId } = jwt.decode(
      req.headers.authorization?.split(' ')[1] || '',
      {},
    ) as IDecodeToken;
    const id = req.params.id;
    const { title, description, done, type } = req.body;
    const updatedTask: any = await pool.query(
      'UPDATE `tasks` SET ? WHERE `id` = ? AND `userId` = ?',
      [
        {
          title,
          description,
          done,
          type,
        },
        id,
        userId,
      ],
    );

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
        error: 'nothing to change',
      });
  } catch (err: unknown) {
    res.json(err);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { userId } = jwt.decode(
      req.headers.authorization?.split(' ')[1] || '',
      {},
    ) as IDecodeToken;
    const id = req.params.id;
    const del: any = await pool.query(
      `'DELETE FROM tasks WHERE id = ${id} AND userId = ${userId}'`.slice(1, -1),
    );

    if (del[0]?.affectedRows === 1) {
      res.json({
        deleted: true,
      });
    } else
      res.json({
        deleted: false,
      });
  } catch (err: unknown) {
    res.json(err);
  }
};

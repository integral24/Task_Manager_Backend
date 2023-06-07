import express, { Request, Response } from 'express';
import taskRoutes from './src/routes/tasks.routes';
import authRoutes from './src/routes/auth.routes';
import tokenRoutes from './src/routes/token.routes';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3002;
const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('The server is enabled..');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: '*',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  credentials: true,
  allowedHeaders: "Origin, Content-Type, Authorization, X-Requested-With",
}

app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/api', taskRoutes);
app.use('/api', authRoutes);
app.use('/api', tokenRoutes);

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}...`);
});

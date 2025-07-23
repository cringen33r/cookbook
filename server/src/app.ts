import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import recipesRouter from './routes/recipes';
import path from 'path';
import uploadsRouter from './routes/uploads';

const app = express();

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api/recipes', recipesRouter);
app.use('/api/uploads', uploadsRouter);

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  }
}));


app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});
export default app;
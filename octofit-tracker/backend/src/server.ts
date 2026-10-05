import cors from 'cors';
import express from 'express';
import { connectDatabase } from './config/database.js';

const app = express();
const port = Number(process.env.PORT || 8000);
const baseUrl = process.env.CODESPACE_NAME
  ? `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(cors());
app.use(express.json());

app.get('/api/health/', (_request, response) => {
  response.json({ status: 'ok' });
});

async function startServer() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`OctoFit API listening at ${baseUrl}`);
  });
}

void startServer();
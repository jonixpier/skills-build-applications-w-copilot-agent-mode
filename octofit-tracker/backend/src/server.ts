import cors from 'cors';
import express from 'express';
import { connectDatabase } from './config/database.js';
import Activity from './models/Activity.js';
import Leaderboard from './models/Leaderboard.js';
import Team from './models/Team.js';
import User from './models/User.js';
import Workout from './models/Workout.js';

const app = express();
const port = Number(process.env.PORT || 8000);
const baseUrl = process.env.CODESPACE_NAME
  ? `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(cors());
app.use(express.json());

app.get('/', (_request, response) => {
  response.json({
    service: 'OctoFit Tracker API',
    baseUrl,
    endpoints: [
      '/api/health/',
      '/api/users/',
      '/api/teams/',
      '/api/activities/',
      '/api/leaderboard/',
      '/api/workouts/',
    ],
  });
});

app.get('/api/health/', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/users/', (_request, response) => {
  return User.find().sort({ displayName: 1 }).then((users) => response.json(users));
});

app.get('/api/teams/', (_request, response) => {
  return Team.find()
    .populate('members', 'displayName username')
    .sort({ name: 1 })
    .then((teams) => response.json(teams));
});

app.get('/api/activities/', (_request, response) => {
  return Activity.find()
    .populate('user', 'displayName username')
    .populate('team', 'name')
    .sort({ performedAt: -1 })
    .then((activities) => response.json(activities));
});

app.get('/api/leaderboard/', (_request, response) => {
  return Leaderboard.find()
    .populate('user', 'displayName username')
    .populate('team', 'name')
    .sort({ rank: 1 })
    .then((entries) => response.json(entries));
});

app.get('/api/workouts/', (_request, response) => {
  return Workout.find().sort({ name: 1 }).then((workouts) => response.json(workouts));
});

async function startServer() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`OctoFit API listening at ${baseUrl}`);
  });
}

void startServer();
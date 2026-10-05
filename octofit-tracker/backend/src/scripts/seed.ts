import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import { connectDatabase } from '../config/database.js';

async function seedDatabase() {
  try {
    console.log('Seed the octofit_db database with test data');
    await connectDatabase();

    await Promise.all([
      Leaderboard.deleteMany({}),
      Activity.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { username: 'averychen', email: 'avery@example.com', displayName: 'Avery Chen', age: 29 },
      { username: 'morganpatel', email: 'morgan@example.com', displayName: 'Morgan Patel', age: 34 },
      { username: 'jordrivera', email: 'jordan@example.com', displayName: 'Jordan Rivera', age: 26 },
    ]);

    const teams = await Team.insertMany([
      {
        name: 'Trailblazers',
        description: 'A running and hiking crew focused on steady progress.',
        members: [users[0]._id, users[1]._id],
      },
      {
        name: 'Pulse Collective',
        description: 'A balanced team for strength, cycling, and recovery.',
        members: [users[1]._id, users[2]._id],
      },
    ]);

    await Activity.insertMany([
      {
        user: users[0]._id,
        team: teams[0]._id,
        type: 'running',
        durationMinutes: 38,
        distanceKm: 6.2,
        caloriesBurned: 410,
        performedAt: new Date(),
      },
      {
        user: users[1]._id,
        team: teams[0]._id,
        type: 'walking',
        durationMinutes: 52,
        distanceKm: 4.1,
        caloriesBurned: 230,
        performedAt: new Date(),
      },
      {
        user: users[2]._id,
        team: teams[1]._id,
        type: 'cycling',
        durationMinutes: 46,
        distanceKm: 18.5,
        caloriesBurned: 520,
        performedAt: new Date(),
      },
    ]);

    await Leaderboard.insertMany([
      { user: users[0]._id, team: teams[0]._id, points: 860, rank: 1, period: 'weekly' },
      { user: users[2]._id, team: teams[1]._id, points: 740, rank: 2, period: 'weekly' },
      { user: users[1]._id, team: teams[0]._id, points: 620, rank: 3, period: 'weekly' },
    ]);

    await Workout.insertMany([
      {
        name: 'Starter Strength',
        description: 'A full-body introduction to strength training.',
        difficulty: 'beginner',
        durationMinutes: 25,
        exercises: [
          { name: 'Bodyweight squat', sets: 3, reps: 10 },
          { name: 'Incline push-up', sets: 3, reps: 8 },
          { name: 'Dead bug', sets: 3, reps: 10 },
        ],
      },
      {
        name: 'Tempo Run',
        description: 'A short run with a controlled tempo interval.',
        difficulty: 'intermediate',
        durationMinutes: 35,
        exercises: [
          { name: 'Easy warm-up', durationSeconds: 600 },
          { name: 'Tempo interval', durationSeconds: 900 },
          { name: 'Easy cool-down', durationSeconds: 600 },
        ],
      },
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();

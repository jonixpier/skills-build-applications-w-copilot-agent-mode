import { model, Schema } from 'mongoose';

const exerciseSchema = new Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number, min: 1 },
    reps: { type: Number, min: 1 },
    durationSeconds: { type: Number, min: 1 },
  },
  { _id: false },
);

const workoutSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    exercises: { type: [exerciseSchema], default: [] },
  },
  { timestamps: true },
);

export default model('Workout', workoutSchema);
import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    age: { type: Number, min: 13, max: 120 },
  },
  { timestamps: true },
);

export default model('User', userSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  percentage: number;
  category: string;
}

const SkillSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  category: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model<ISkill>('Skill', SkillSchema);
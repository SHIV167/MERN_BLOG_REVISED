import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  technologies: string[];
}

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  projectUrl: {
    type: String,
    default: ''
  },
  technologies: {
    type: [String],
    required: true
  }
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
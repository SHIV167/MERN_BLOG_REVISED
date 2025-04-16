import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  category: string;
}

const BlogPostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface IYoutubeVideo extends Document {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

const YoutubeVideoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model<IYoutubeVideo>('YoutubeVideo', YoutubeVideoSchema);
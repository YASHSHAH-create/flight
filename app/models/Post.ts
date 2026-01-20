
import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    category: string;
    readTime: string;
    imageUrl: string;
    keywords: string[];
    views: number;
}

const PostSchema: Schema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true }, // HTML content
    date: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    readTime: { type: String, required: true },
    imageUrl: { type: String, required: true },
    keywords: { type: [String], default: [] },
    views: { type: Number, default: 0 }, // New field for view count
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

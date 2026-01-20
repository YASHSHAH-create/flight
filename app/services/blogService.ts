
import dbConnect from '../lib/db';
import Post, { IPost } from '../models/Post';
import { BlogPost, BLOG_POSTS as STATIC_POSTS } from '../lib/blog-data';

// Helper to convert Mongoose doc to BlogPost interface
function mapDocToPost(doc: any): BlogPost {
    return {
        title: doc.title,
        slug: doc.slug,
        excerpt: doc.excerpt,
        content: doc.content,
        date: doc.date,
        author: doc.author,
        category: doc.category,
        readTime: doc.readTime,
        imageUrl: doc.imageUrl,
        keywords: doc.keywords,
        views: doc.views || 0
    };
}

export async function getAllPosts(): Promise<BlogPost[]> {
    try {
        await dbConnect();
        // Fetch from DB
        const dbPosts = await Post.find({}).sort({ createdAt: -1 }).lean();
        const mappedDbPosts = dbPosts.map(mapDocToPost);
        return [...mappedDbPosts, ...STATIC_POSTS.map(p => ({ ...p, views: 0 }))];
    } catch (error) {
        console.warn("Database fetch failed in getAllPosts, falling back to static content:", error);
        return STATIC_POSTS.map(p => ({ ...p, views: 0 }));
    }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        await dbConnect();
        const dbPost = await Post.findOne({ slug }).lean();
        if (dbPost) {
            return mapDocToPost(dbPost);
        }
    } catch (error) {
        console.warn(`Database fetch failed in getPostBySlug for ${slug}:`, error);
    }

    // Check static
    const staticPost = STATIC_POSTS.find(p => p.slug === slug);
    if (staticPost) {
        return { ...staticPost, views: 0 };
    }

    return null;
}

export async function savePost(post: BlogPost): Promise<boolean> {
    await dbConnect();
    try {
        // Upsert based on slug
        await Post.findOneAndUpdate(
            { slug: post.slug },
            post,
            { upsert: true, new: true }
        );
        return true;
    } catch (error) {
        console.error("Error saving post to DB:", error);
        return false;
    }
}

export async function incrementViewCount(slug: string): Promise<number> {
    await dbConnect();
    try {
        const post = await Post.findOneAndUpdate(
            { slug },
            { $inc: { views: 1 } },
            { new: true }
        );
        return post ? post.views : 0;
    } catch (error) {
        console.error("Error incrementing view count:", error);
        return 0;
    }
}

export async function deletePost(slug: string): Promise<boolean> {
    await dbConnect();
    try {
        await Post.findOneAndDelete({ slug });
        return true;
    } catch (error) {
        console.error("Error deleting post:", error);
        return false;
    }
}

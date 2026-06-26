
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
        
        // Auto-seed if empty
        if (dbPosts.length === 0) {
            console.log("DB is empty. Auto-seeding static posts...");
            const postsToInsert = STATIC_POSTS.map(p => ({
                title: p.title,
                slug: p.slug,
                excerpt: p.excerpt,
                content: p.content,
                date: p.date,
                author: p.author,
                category: p.category,
                readTime: p.readTime,
                imageUrl: p.imageUrl,
                keywords: p.keywords,
                views: 0
            }));
            await Post.insertMany(postsToInsert);
            return STATIC_POSTS.map(p => ({ ...p, views: 0 }));
        }

        // If there are missing posts, sync them
        const dbSlugs = new Set(dbPosts.map(p => p.slug));
        const missingPosts = STATIC_POSTS.filter(p => !dbSlugs.has(p.slug));
        if (missingPosts.length > 0) {
            console.log(`Auto-seeding ${missingPosts.length} missing static posts...`);
            const postsToInsert = missingPosts.map(p => ({
                title: p.title,
                slug: p.slug,
                excerpt: p.excerpt,
                content: p.content,
                date: p.date,
                author: p.author,
                category: p.category,
                readTime: p.readTime,
                imageUrl: p.imageUrl,
                keywords: p.keywords,
                views: 0
            }));
            await Post.insertMany(postsToInsert);
            const updatedDbPosts = await Post.find({}).sort({ createdAt: -1 }).lean();
            return updatedDbPosts.map(mapDocToPost);
        }

        return dbPosts.map(mapDocToPost);
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

        // Auto-seed this post if it exists in static list
        const staticPost = STATIC_POSTS.find(p => p.slug === slug);
        if (staticPost) {
            console.log(`Auto-seeding post ${slug} on demand...`);
            const created = await Post.create({ ...staticPost, views: 0 });
            return mapDocToPost(created);
        }
    } catch (error) {
        console.warn(`Database fetch failed in getPostBySlug for ${slug}:`, error);
    }

    // Check static fallback
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

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Post from '@/app/models/Post';
import { BLOG_POSTS } from '@/app/lib/blog-data';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        
        let createdCount = 0;
        let updatedCount = 0;

        for (const post of BLOG_POSTS) {
            const existingPost = await Post.findOne({ slug: post.slug });
            
            if (existingPost) {
                // Update post content but preserve existing views
                await Post.findOneAndUpdate(
                    { slug: post.slug },
                    {
                        title: post.title,
                        excerpt: post.excerpt,
                        content: post.content,
                        date: post.date,
                        author: post.author,
                        category: post.category,
                        readTime: post.readTime,
                        imageUrl: post.imageUrl,
                        keywords: post.keywords,
                        // views is kept as is
                    }
                );
                updatedCount++;
            } else {
                // Insert new post
                await Post.create({
                    ...post,
                    views: 0
                });
                createdCount++;
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Synchronized ${BLOG_POSTS.length} posts.`,
            details: { created: createdCount, updated: updatedCount }
        });
    } catch (error: any) {
        console.error("Sync API error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || 'Synchronization failed' 
        }, { status: 500 });
    }
}


import { NextResponse } from 'next/server';
import { getAllPosts } from '@/app/services/blogService';

export async function GET() {
    try {
        // This will fetch both DB and Static posts
        // For admin purposes, we might only want to edit DB posts? 
        // But getAllPosts combines them. 
        // If we want to allow "overriding" a static post by saving it to DB with same slug, that works too.
        const posts = await getAllPosts();
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

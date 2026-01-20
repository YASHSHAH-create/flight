
import { NextRequest, NextResponse } from 'next/server';
import { savePost } from '@/app/services/blogService';
import { BlogPost } from '@/app/lib/blog-data';

export async function POST(req: NextRequest) {
    try {
        const postData: BlogPost = await req.json();

        // Auto-fill missing fields if any
        postData.date = new Date().toISOString().split('T')[0];
        postData.author = "Paymm Admin"; // simplified
        postData.imageUrl = "/blog/img1.png"; // Default image for now

        const success = savePost(postData);

        if (success) {
            return NextResponse.json({ success: true, message: 'Post published successfully' });
        } else {
            return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

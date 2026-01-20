
import { NextRequest, NextResponse } from 'next/server';
import { deletePost } from '@/app/services/blogService';

export async function DELETE(req: NextRequest) {
    try {
        const { slug } = await req.json();

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        const success = await deletePost(slug);

        if (success) {
            return NextResponse.json({ success: true, message: 'Post deleted successfully' });
        } else {
            return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}


import { NextRequest, NextResponse } from 'next/server';
import { incrementViewCount } from '@/app/services/blogService';

export async function POST(req: NextRequest) {
    try {
        const { slug, increment } = await req.json();

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        let newViewCount;
        if (increment) {
            newViewCount = await incrementViewCount(slug);
        } else {
            // Just get current count
            const { getPostBySlug } = await import('@/app/services/blogService');
            const post = await getPostBySlug(slug);
            newViewCount = post ? post.views : 0;
        }

        return NextResponse.json({ views: newViewCount });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update views' }, { status: 500 });
    }
}

"use client";

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function ViewCounter({ slug, initialViews = 0 }: { slug: string, initialViews?: number }) {
    const [views, setViews] = useState(initialViews);
    const [hasViewed, setHasViewed] = useState(false);

    useEffect(() => {
        // Check local storage to see if user has already viewed THIS slug
        const viewedKey = `viewed_${slug}`;
        const alreadyViewed = localStorage.getItem(viewedKey);

        if (!alreadyViewed) {
            // If not viewed, call API to increment
            fetch('/api/blog/view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, increment: true })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.views !== undefined) {
                        setViews(data.views);
                        localStorage.setItem(viewedKey, 'true'); // Mark as viewed
                        setHasViewed(true);
                    }
                })
                .catch(err => console.error(err));
        } else {
            // If already viewed, just fetch the latest count without incrementing
            fetch('/api/blog/view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, increment: false })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.views !== undefined) {
                        setViews(data.views);
                    }
                })
                .catch(err => console.error(err));
            setHasViewed(true);
        }
    }, [slug]);

    return (
        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full">
            <Eye size={16} className={hasViewed ? "text-blue-500" : "text-slate-400"} />
            <span>{views.toLocaleString()} views</span>
        </div>
    );
}

import React from 'react';
import SEOHiddenContent from '@/app/components/SEOHiddenContent';

export default function TestSEOPage() {
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">SEO Content Debug Preview</h1>
            <p className="mb-8 bg-yellow-100 p-4 rounded text-yellow-800">
                This page displays the "Hidden" SEO content so you can verify what Google Bots will see in the source code.
                In the actual website, this content is visually hidden.
            </p>

            <div className="border border-slate-300 p-4 rounded shadow-sm [&>div]:!static [&>div]:!w-auto [&>div]:!h-auto [&>div]:!m-0 [&>div]:!clip-auto [&>div]:!whitespace-normal [&>div]:!overflow-visible">
                <SEOHiddenContent />
            </div>
        </div>
    );
}

import React from 'react';
import { COMPANY, ORG_ID } from '@/app/lib/company';

/**
 * Homepage-only schema. Organization + WebSite live in the root layout
 * (one entity, one @id); FAQPage is emitted by <FAQSection/>. Keeping each
 * entity in exactly one place avoids the duplicate-schema warnings Google
 * raises when the same FAQ/Organization appears twice on a page.
 */
export default function JsonLd() {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${COMPANY.url}/#webpage`,
                url: COMPANY.url,
                name: "Paymm – Cheap Flight Tickets | Compare & Book Air Tickets Online",
                isPartOf: { "@id": `${COMPANY.url}/#website` },
                about: { "@id": ORG_ID },
                publisher: { "@id": ORG_ID },
                inLanguage: "en-IN",
                primaryImageOfPage: { "@type": "ImageObject", url: COMPANY.ogImage },
                speakable: {
                    "@type": "SpeakableSpecification",
                    cssSelector: ["h1", "#faq-section h2"],
                },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: COMPANY.url },
                ],
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

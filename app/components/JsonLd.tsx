import React from 'react';

export default function JsonLd() {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "name": "Paymm",
                "url": "https://paymm.in",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://paymm.in/search?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "Organization",
                "name": "Paymm",
                "url": "https://paymm.in",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://paymm.in/logo.png"
                },
                "sameAs": [
                    "https://twitter.com/paymm",
                    "https://facebook.com/paymm"
                ]
            },
            {
                "@type": "Product",
                "name": "Flight Tickets",
                "image": "https://paymm.in/og-image.jpg",
                "description": "Book cheap flight tickets from India to anywhere in the world.",
                "brand": {
                    "@type": "Brand",
                    "name": "Paymm"
                },
                "offers": {
                    "@type": "Offer",
                    "url": "https://paymm.in",
                    "priceCurrency": "INR",
                    "price": "3000",
                    "availability": "https://schema.org/InStock",
                    "priceValidUntil": "2025-12-31"
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "How to book cheap flights on Paymm?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Simply enter your origin, destination, and travel dates in the search widget to find the best deals. We compare prices across multiple airlines."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Can I cancel my flight booking?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, cancellation policies depend on the airline and fare type. You can manage your bookings in the My Bookings section."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

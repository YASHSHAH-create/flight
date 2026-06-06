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
                "@type": ["Organization", "LocalBusiness", "TravelAgency"],
                "name": "Paymm",
                "legalName": "PAYMM ADVISORY PRIVATE LIMITED",
                "taxID": "10AAMCP7167L1Z1",
                "url": "https://paymm.in",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://paymm.in/paymm.png"
                },
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "123 Travel Space, Tech Park",
                    "addressLocality": "New Delhi",
                    "postalCode": "110001",
                    "addressCountry": "IN"
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91 9343300271",
                    "contactType": "Customer Support",
                    "email": "support@paymm.in",
                    "availableLanguage": ["English", "Hindi"]
                },
                "sameAs": [
                    "https://www.instagram.com/paymm_bookings/",
                    "https://www.linkedin.com/company/paymm/"
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
                    "priceValidUntil": "2026-12-31"
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Why is flight ticket booking the cheapest on Paymm?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Paymm directly searches multiple airline websites for the cheapest fares. Many airlines sell their cheapest flight tickets on Paymm. Additionally, with its exclusive offers and deals, including several bank and partner offers, Paymm serves as the best and cheap platform to book cheap flights online."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How do I book cheap flight tickets?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Here's how you can book cheap flight tickets:\n\n• Book your flights from Paymm in advance (2 to 3 weeks prior to your journey) to get the cheapest deals. New users also get Flat 12% off with code 'NEW'\n• Be flexible, and consider flying during off-peak hours to get cheaper flight tickets.\n• Use Paymm's fare alerts feature, it sends you notifications when the air ticket price on your route gets cheap.\n• Try taking a stopover flight if you have the time, these flights are frequently less expensive.\n• Weekend travel is best avoided because airfares are typically higher during this time."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What are the benefits of flight booking with Paymm?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Cheap fares, simple flight booking, live flight status tracking, exclusive flight ticket offers, flexible date options, price lock, travel insurance, automatic web-checkin, 24*7 customer care support and quick refunds are all advantages of booking flights with Paymm."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Can I modify or cancel my booking?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, you can modify or cancel your flight with Assured and Assured Flex fares. Assured offers free cancellations on new bookings, while Assured Flex provides free cancellations or one-time free rescheduling, including date, airline, and route changes."
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

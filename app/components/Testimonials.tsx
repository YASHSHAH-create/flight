
import React from 'react';

const testimonials = [
    {
        id: 1,
        name: "Sarah Jenkins",
        text: "The best travel experience I've ever had. paymm made everything so easy!",
        role: "Frequent Flyer"
    },
    {
        id: 2,
        name: "Michael Chen",
        text: "Incredible prices and amazing customer service. Will definitely book again.",
        role: "Business Traveler"
    },
    {
        id: 3,
        name: "Emma Wilson",
        text: "Found the perfect family vacation package. The kids loved it!",
        role: "Family Traveler"
    }
];

const Testimonials = () => {
    return (
        <section className="py-6 px-4 md:px-16">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 text-center">What Travelers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                    <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <p className="text-sm text-slate-600 mb-4 italic line-clamp-2">"{t.text}"</p>
                        <div>
                            <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                            <p className="text-xs text-slate-400">{t.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;

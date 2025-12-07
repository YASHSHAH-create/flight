
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
        <section className="py-[3vh] px-[4vw] md:px-[6vw]">
            <h2 className="text-[clamp(1.5rem,2.5vw,2.25rem)] font-bold mb-[2vh] text-slate-900 text-center">What Travelers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[2vh]">
                {testimonials.map((t) => (
                    <div key={t.id} className="bg-white p-[clamp(1rem,1.5vw,1.5rem)] rounded-[clamp(0.75rem,1vw,1rem)] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <p className="text-[clamp(0.875rem,1vw,1rem)] text-slate-600 mb-[1.5vh] italic line-clamp-2">"{t.text}"</p>
                        <div>
                            <h4 className="font-bold text-[clamp(0.875rem,1vw,1rem)] text-slate-900">{t.name}</h4>
                            <p className="text-[clamp(0.75rem,0.8vw,0.875rem)] text-slate-400">{t.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;

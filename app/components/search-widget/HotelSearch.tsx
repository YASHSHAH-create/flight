import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';

const PRICE_CHIPS = ['₹0–2,000', '₹2,000–5,000', '₹5,000+'];

const HotelSearch = () => {
    const [city] = useState({ name: 'Goa', country: 'India' });
    const [guests] = useState({ count: 2, rooms: 1 });
    const [dates] = useState({ checkIn: 'Today', checkOut: 'Tomorrow' });
    const [chip, setChip] = useState<string | null>(null);
    const router = useRouter();
    const go = () => router.push('/hotels/search');
    const cell = 'field-cell border border-hair bg-lav min-h-[64px] md:min-h-[76px] flex flex-col justify-center';

    return (
        <div className="animate-subtle-up">
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-2 md:gap-3">
                <button type="button" onClick={go} className={`col-span-2 lg:col-span-4 ${cell}`}>
                    <span className="field-label"><MapPin size={12} className="inline mr-1 -mt-0.5" />City or property</span>
                    <span className="field-value">{city.name}</span>
                    <span className="field-sub">{city.country}</span>
                </button>
                <button type="button" onClick={go} className={`lg:col-span-2 ${cell}`}>
                    <span className="field-label"><Calendar size={12} className="inline mr-1 -mt-0.5" />Check-in</span>
                    <span className="field-value">{dates.checkIn}</span>
                </button>
                <button type="button" onClick={go} className={`lg:col-span-2 ${cell}`}>
                    <span className="field-label"><Calendar size={12} className="inline mr-1 -mt-0.5" />Check-out</span>
                    <span className="field-value">{dates.checkOut}</span>
                </button>
                <button type="button" onClick={go} className={`col-span-2 lg:col-span-2 ${cell}`}>
                    <span className="field-label"><Users size={12} className="inline mr-1 -mt-0.5" />Rooms &amp; guests</span>
                    <span className="field-value">{guests.rooms} Room · {guests.count} Adults</span>
                </button>
                <button onClick={go} className="col-span-2 lg:col-span-2 min-h-[56px] md:min-h-[76px] bg-brand text-white rounded-xl md:rounded-2xl font-bold hover:bg-brand-hover hover:shadow-[0_10px_30px_rgba(79,43,208,0.25)] transition-all flex items-center justify-center gap-2">
                    Search Hotels <ArrowRight size={18} />
                </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-ink-2 font-semibold">Price per night:</span>
                {PRICE_CHIPS.map((c) => (
                    <button key={c} type="button" onClick={() => setChip(chip === c ? null : c)} className={`px-3 py-1 rounded-full border font-semibold transition-colors ${chip === c ? 'bg-brand text-white border-brand' : 'bg-white text-ink-2 border-hair hover:border-brand'}`}>{c}</button>
                ))}
            </div>
        </div>
    );
};

export default HotelSearch;

import React from 'react';
import { Plane, Building, Car } from 'lucide-react';

interface TabSelectorProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TabSelector = ({ activeTab, onTabChange }: TabSelectorProps) => {
    const tabs = [
        { id: 'flight', label: 'Flight', icon: Plane },
        { id: 'hotel', label: 'Hotel', icon: Building },
        { id: 'car', label: 'Rent a Car', icon: Car },
    ];

    return (
        <div className="flex items-center justify-center space-x-2 mb-4 relative z-10 py-1">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
              flex items-center space-x-2 px-4 py-2 rounded-full font-bold text-xs shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0 border
              ${isActive
                                ? 'bg-white text-black border-slate-100'
                                : 'bg-white/40 backdrop-blur-md text-slate-800 border-white/20 hover:bg-white/60'
                            }
            `}
                    >
                        <Icon size={14} />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default TabSelector;

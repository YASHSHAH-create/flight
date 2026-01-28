import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface DatePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (date: Date) => void;
    title: string;
    selectedDate?: Date;
    minDate?: Date;
}

const DatePickerModal = ({ isOpen, onClose, onSelect, title, selectedDate, minDate = new Date() }: DatePickerModalProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen && selectedDate) {
            setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
        } else if (isOpen) {
            setCurrentMonth(new Date());
        }
    }, [isOpen, selectedDate]);

    if (!mounted) return null;

    const changeMonth = (increment: number) => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + increment, 1));
    };

    const handleDateSelect = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        // Normalize time
        date.setHours(0, 0, 0, 0);
        onSelect(date);
    };

    // Helper to compare dates (ignoring time)
    const isSameDate = (d1?: Date, d2?: Date) => {
        if (!d1 || !d2) return false;
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    // Helper to check if date is before minDate (ignoring time)
    const isDisabled = (d: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const min = minDate < today ? today : minDate;
        min.setHours(0, 0, 0, 0);
        return d < min;
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-end md:justify-center bg-slate-900/60 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 cursor-pointer"
                        aria-hidden="true"
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white w-full md:w-[400px] md:rounded-2xl rounded-t-[2rem] shadow-2xl relative z-10 md:mx-auto md:my-auto h-auto flex flex-col overflow-hidden pb-8"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                <ChevronDown size={20} className="rotate-90" />
                            </button>
                            <h3 className="text-lg font-bold text-slate-800">
                                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button
                                onClick={() => changeMonth(1)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                <ChevronDown size={20} className="-rotate-90" />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="text-center font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                                {title}
                            </div>
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                    <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
                                    <div key={`empty-${i}`} />
                                ))}
                                {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                    const day = i + 1;
                                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                    date.setHours(0, 0, 0, 0);

                                    const isSelected = isSameDate(selectedDate, date);
                                    const isPast = isDisabled(date);

                                    return (
                                        <button
                                            key={day}
                                            disabled={isPast}
                                            onClick={() => handleDateSelect(day)}
                                            className={`
                                                h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                                ${isSelected ? 'bg-black text-white shadow-lg scale-110' : 'text-slate-700 hover:bg-slate-100'}
                                                ${isPast ? 'opacity-20 cursor-not-allowed hover:bg-transparent' : ''}
                                            `}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default DatePickerModal;

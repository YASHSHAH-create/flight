'use client';

import { motion } from 'framer-motion';
import React from 'react';

export default function AnimatedSection({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col justify-evenly max-w-7xl mx-auto w-full gap-20">
            {children}
        </div>
    );
}

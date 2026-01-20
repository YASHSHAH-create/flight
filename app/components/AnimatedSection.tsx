'use client';

import { motion } from 'framer-motion';
import React from 'react';

export default function AnimatedSection({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            className="flex flex-col justify-evenly max-w-7xl mx-auto w-full gap-20"
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
        >
            {children}
        </motion.div>
    );
}

"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface LottieAnimationProps {
    url: string;
    className?: string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ url, className }) => {
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        const fetchAnimation = async () => {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setAnimationData(data);
                }
            } catch (error) {
                console.error("Error loading Lottie animation:", error);
            }
        };

        fetchAnimation();
    }, [url]);

    if (!animationData) return null;

    return (
        <div className={className}>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
};

export default LottieAnimation;

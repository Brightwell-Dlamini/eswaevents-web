// components/Hero.tsx
'use client';

import { motion, useTransform, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BackgroundCarousel } from './Hero/BackgroundCarousel';
import { HeroTextSection } from './Hero/HeroTextSection';

import { ScrollIndicator } from './Hero/ScrollIndicator';
import { EventsCarousel } from './Hero/EventCarousel';

export const Hero = () => {
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let lastScrollY = window.scrollY;
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, []);

  const yPos = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(
    scrollY,
    [0, 200],
    [1, scrollDirection === 'down' ? 0.3 : 1]
  );

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden h-[80vh] sm:h-[100vh]">
      <BackgroundCarousel />
      <div className="absolute inset-0 z-0 bg-black/20" />

      <motion.div
        className="relative z-10 pt-28 pb-4 px-4 sm:px-6 lg:px-8 h-full flex flex-col"
        style={{ y: yPos, opacity }}
      >
        <div className="max-w-[90vw] mx-auto flex flex-col w-full">
          <HeroTextSection />
          <EventsCarousel />
        </div>
        <ScrollIndicator />
      </motion.div>
    </section>
  );
};

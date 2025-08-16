// components/EventsCarousel.tsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { EventCard } from './EventCard';
import { HeroEvents } from '@/lib/mockData';
import { Event } from '@/types/types';

export const EventsCarousel = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const visibleEvents = HeroEvents.slice(carouselIndex, carouselIndex + 4);

  useEffect(() => {
    const carouselInterval = setInterval(() => {
      setCarouselIndex((prev) =>
        prev >= HeroEvents.length - 4 ? 0 : prev + 2
      );
    }, 10000);

    return () => clearInterval(carouselInterval);
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto flex-grow-0">
      <div className="justify-between flex  items-center">
        <div className="font-bold justify-start text-amber-100 text-lg pl-4">
          Trending Events
        </div>
        <div className="flex justify-end items-center my-4 px-4">
          <button
            onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 2))}
            disabled={carouselIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
          >
            <ChevronLeftIcon className="h-5 w-5 text-white" />
          </button>

          <div className="flex items-center gap-4 mx-4">
            {Array.from({ length: Math.ceil(HeroEvents.length / 4) }).map(
              (_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCarouselIndex(i * 4)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-1 focus:outline-none"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <motion.span
                    className={`block w-2 h-2 rounded-full transition-all ${
                      carouselIndex === i * 4
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg shadow-pink-500/50'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    initial={false}
                    animate={{
                      width: carouselIndex === i * 4 ? 16 : 12,
                      height: carouselIndex === i * 4 ? 16 : 12,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                  {carouselIndex === i * 4 && (
                    <motion.span
                      className="absolute inset-0 rounded-full border-1 border-pink-400/50"
                      initial={{ scale: 1.3, opacity: 0 }}
                      animate={{ scale: 1.6, opacity: 0.4 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: 'reverse',
                        duration: 1.5,
                      }}
                    />
                  )}
                </motion.button>
              )
            )}
          </div>

          <button
            onClick={() =>
              setCarouselIndex(
                Math.min(HeroEvents.length - 4, carouselIndex + 2)
              )
            }
            disabled={carouselIndex >= HeroEvents.length - 4}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
          >
            <ChevronRightIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4"
      >
        {visibleEvents.map((event: Event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -10 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

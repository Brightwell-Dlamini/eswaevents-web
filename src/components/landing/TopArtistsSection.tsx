// components/TopArtistsSection.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ArtistCard } from './Artist/ArtistCard';
import { topArtists } from '@/lib/mockData';
import { useState, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';

const CARD_COUNT = {
  base: 1,
  sm: 2,
  lg: 4,
};

const AUTO_PLAY_INTERVAL = 5000;

export const TopArtistsSection = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(CARD_COUNT.lg);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // Debounced resize handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerWidth < 640) {
          setVisibleCards(CARD_COUNT.base);
        } else if (window.innerWidth < 1024) {
          setVisibleCards(CARD_COUNT.sm);
        } else {
          setVisibleCards(CARD_COUNT.lg);
        }
      }, 100);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Infinite loop carousel
  const nextSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % topArtists.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCarouselIndex(
      (prev) => (prev - 1 + topArtists.length) % topArtists.length
    );
  }, []);

  // Auto-play carousel with pause on focus/hover/touch
  useEffect(() => {
    if (!isAutoPlaying || isFocused || isTouched) return;

    const interval = setInterval(() => {
      nextSlide();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isFocused, isTouched, nextSlide]);

  const getVisibleArtists = () => {
    const artists = [];
    for (let i = 0; i < visibleCards; i++) {
      const index = (carouselIndex + i) % topArtists.length;
      artists.push(topArtists[index]);
    }
    return artists;
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => !isFocused && nextSlide(),
    onSwipedRight: () => !isFocused && prevSlide(),
    onTouchStartOrOnMouseDown: () => setIsTouched(true),
    onTouchEndOrOnMouseUp: () => setIsTouched(false),
    trackMouse: true,
    delta: 50,
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const totalGroups = Math.ceil(topArtists.length / visibleCards);
  const activeGroup = Math.floor(carouselIndex / visibleCards);

  return (
    <section
      className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
      aria-label="Top Artists in Eswatini"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Top Artists in Eswatini
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the most popular performers lighting up stages across the
            kingdom
          </p>
        </motion.div>

        <div className="relative">
          <a href="#skip-carousel" className="sr-only focus:not-sr-only">
            Skip carousel
          </a>

          <div
            className="relative"
            {...swipeHandlers}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onTouchStart={() => setIsTouched(true)}
            onTouchEnd={() => setIsTouched(false)}
            aria-live="polite"
          >
            <div className="flex justify-between items-center mb-6">
              <motion.button
                onClick={prevSlide}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Previous artists"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </motion.button>

              <div className="flex space-x-2">
                {Array.from({ length: totalGroups }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIndex(i * visibleCards)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeGroup === i
                        ? 'bg-blue-600 w-6'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 w-2'
                    }`}
                    aria-label={`Go to group ${i + 1}`}
                    aria-current={activeGroup === i}
                  />
                ))}
              </div>

              <motion.button
                onClick={nextSlide}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                aria-label="Next artists"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={carouselIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {getVisibleArtists().map((artist, index) => (
                    <ArtistCard
                      key={`${artist.id}-${carouselIndex}-${index}`}
                      artist={artist}
                      index={index}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div id="skip-carousel" className="sr-only" aria-hidden="true" />
        </div>

        <div className="mt-12 text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-medium rounded-lg hover:from-yellow-700 hover:to-yellow-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="View all artists"
          >
            View All Artists
          </motion.button>
        </div>
      </div>
    </section>
  );
};

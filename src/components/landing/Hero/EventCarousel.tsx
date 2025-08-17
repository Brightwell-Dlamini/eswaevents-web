import { motion, useAnimation, PanInfo } from 'framer-motion';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

import { EventCard } from './EventCard';
import { HeroEvents } from '@/lib/mockData';
import { Event } from '@/types/types';
import { formatDate } from '@/lib/utils';

const VISIBLE_EVENTS_COUNT = 4;
const AUTO_SCROLL_INTERVAL = 8000;
const DRAG_THRESHOLD = 50;

const SearchSuggestionItem = ({ event }: { event: Event }) => {
  return (
    <a
      href={`/events/${event.id}`}
      className="block hover:no-underline"
      onClick={(e) => e.stopPropagation()}
      aria-label={`Event: ${event.name}`}
    >
      <div className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
        <div className="w-16 h-16 flex-shrink-0 relative rounded-md overflow-hidden">
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover"
            sizes="64px"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-event.jpg';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold truncate text-white">
            {event.name}
          </h4>
          <div className="flex items-center text-xs text-gray-300 mt-1">
            <CalendarIcon className="h-3 w-3 mr-1" aria-hidden="true" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-xs text-gray-300 mt-1">
            <MapPinIcon className="h-3 w-3 mr-1" aria-hidden="true" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export const EventsCarousel = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Event[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const controls = useAnimation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const totalEvents = HeroEvents.length;
  const loopThreshold = totalEvents - VISIBLE_EVENTS_COUNT;

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);
    if (info.offset.x > DRAG_THRESHOLD) {
      handlePrev();
    } else if (info.offset.x < -DRAG_THRESHOLD) {
      handleNext();
    }
  };

  const handleNext = useCallback(() => {
    setCarouselIndex((prev) => (prev >= loopThreshold ? 0 : prev + 1));
    controls.start({ x: -100, opacity: 0 }).then(() => {
      controls.start({ x: 0, opacity: 1 });
    });
  }, [loopThreshold, controls]);

  const handlePrev = useCallback(() => {
    setCarouselIndex((prev) => (prev <= 0 ? loopThreshold : prev - 1));
    controls.start({ x: 100, opacity: 0 }).then(() => {
      controls.start({ x: 0, opacity: 1 });
    });
  }, [loopThreshold, controls]);

  const getVisibleEvents = useMemo(() => {
    const endIndex = carouselIndex + VISIBLE_EVENTS_COUNT;
    if (endIndex > HeroEvents.length) {
      return [
        ...HeroEvents.slice(carouselIndex),
        ...HeroEvents.slice(0, endIndex % HeroEvents.length),
      ];
    }
    return HeroEvents.slice(carouselIndex, endIndex);
  }, [carouselIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      handleNext();
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(interval);
  }, [isDragging, handleNext]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const filtered = HeroEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleEvents = getVisibleEvents;
  const hasMoreResults = suggestions.length > 5;

  return (
    <div className="relative w-full max-w-[90vw] mx-auto flex-grow-0 z-10">
      <div className="justify-between flex items-center mb-2">
        <h2 className="font-bold justify-start text-amber-100 text-2xl">
          Trending Events
        </h2>

        <div className="flex-1 max-w-md mx-4 relative z-50" ref={searchRef}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Who or what do you wanna see live?"
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 pl-12 pr-6 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                aria-label="Search events"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-white/80"
                  aria-hidden="true"
                />
              </div>
            </div>

            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-[60] mt-2 w-full bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-white/10"
                style={{
                  top: '100%',
                  left: 0,
                }}
              >
                <div className="py-2 max-h-80 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-300">
                      Loading...
                    </div>
                  ) : suggestions.length > 0 ? (
                    <>
                      {suggestions.slice(0, 5).map((event) => (
                        <SearchSuggestionItem key={event.id} event={event} />
                      ))}
                      {hasMoreResults && (
                        <a
                          href={`/events/search?q=${encodeURIComponent(searchQuery)}`}
                          className="block px-4 py-3 text-sm font-medium text-center text-purple-400 hover:text-purple-300 hover:bg-white/5 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="See all results"
                        >
                          See all {suggestions.length} results →
                        </a>
                      )}
                    </>
                  ) : (
                    <div className="p-4 text-center text-gray-300">
                      No events found for &quot;{searchQuery}&quot;
                      <p className="text-xs mt-1">Try different keywords</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="flex justify-end items-center px-4">
          <button
            onClick={handlePrev}
            disabled={HeroEvents.length <= VISIBLE_EVENTS_COUNT}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all hover:scale-105"
            aria-label="Previous events"
          >
            <ChevronLeftIcon
              className="h-5 w-5 text-white"
              aria-hidden="true"
            />
          </button>

          <div className="flex items-center gap-4 mx-4">
            {Array.from({
              length: Math.ceil(HeroEvents.length / VISIBLE_EVENTS_COUNT),
            }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setCarouselIndex(i * VISIBLE_EVENTS_COUNT)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-1 focus:outline-none"
                aria-label={`Go to slide ${i + 1}`}
              >
                <motion.span
                  className={`block rounded-full transition-all ${
                    carouselIndex === i * VISIBLE_EVENTS_COUNT
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg shadow-pink-500/50'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  initial={false}
                  animate={{
                    width: carouselIndex === i * VISIBLE_EVENTS_COUNT ? 16 : 12,
                    height:
                      carouselIndex === i * VISIBLE_EVENTS_COUNT ? 16 : 12,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
                {carouselIndex === i * VISIBLE_EVENTS_COUNT && (
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
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={HeroEvents.length <= VISIBLE_EVENTS_COUNT}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all hover:scale-105"
            aria-label="Next events"
          >
            <ChevronRightIcon
              className="h-5 w-5 text-white"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <motion.div
        ref={carouselRef}
        drag="x"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dragConstraints={{ left: 0, right: 0 }}
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 px-4"
        aria-live="polite"
        aria-atomic="true"
      >
        {visibleEvents.map((event: Event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -10 }}
            className="relative"
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

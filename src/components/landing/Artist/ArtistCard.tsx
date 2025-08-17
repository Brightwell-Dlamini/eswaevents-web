// components/Artist/ArtistCard.tsx
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StarIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { Artist } from '@/types/types';
import { useState } from 'react';

interface ArtistCardProps {
  artist: Artist;
  index: number;
}

export const ArtistCard = ({ artist, index }: ArtistCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageAlt = `${artist.name}, ${artist.genre} artist from Eswatini`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800 h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      tabIndex={0}
      aria-label={`Artist: ${artist.name}, ${artist.genre}`}
      role="article"
    >
      {index < 3}

      <div className="relative h-48">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-t-xl" />
        )}
        <Image
          src={imageError ? '/default-artist.webp' : artist.image}
          alt={imageAlt}
          fill
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={index > 2 ? 'lazy' : 'eager'}
          priority={index < 2}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {artist.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {artist.genre}
            </p>
          </div>

          <motion.div
            className="flex items-center bg-blue-100/50 dark:bg-blue-900/20 px-2 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-xs font-bold">{artist.rating}</span>
          </motion.div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{artist.upcomingEvents} upcoming</span>
          </div>

          {artist.isLocal && (
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md"
              aria-label="Local artist"
            >
              Local Artist
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

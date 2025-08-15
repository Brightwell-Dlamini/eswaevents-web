import Image from 'next/image';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { ClockIcon } from 'lucide-react';
import { Event } from '@/types/types';
import { calculateTimeLeft, formatDate } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <article className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 h-full">
      <div className="relative h-30">
        <Image
          src={event.image}
          alt={`${event.name} promotional image`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={event.imagePriority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-800 dark:text-gray-200 shadow-sm">
          {event.category}
        </div>

        <div
          className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
            event.price === 0
              ? 'bg-green-500/90 text-white'
              : 'bg-white/90 text-gray-800'
          }`}
        >
          {event.price}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {event.name}
            </h3>

            <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1 text-sm">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1 text-sm">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{event.location}</span>
            </div>
          </div>

          {event.ticketsLeft !== null ? (
            <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
              Only {event.ticketsLeft} left
            </span>
          ) : (
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
              Free Entry
            </span>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700 text-sm">
          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <ClockIcon className="h-4 w-4" />
            <span className="font-medium">{calculateTimeLeft(event.date)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

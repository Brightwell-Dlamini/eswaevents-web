// types/event.ts
export type EventStatus = 'draft' | 'published' | 'completed' | 'canceled';

export interface Event {
    id: number;
    title: string;
    date: string;
    status: EventStatus;
    attendees: number;
    revenue: number;
    ticketsSold: number;
    capacity: number;
    image?: string;
}
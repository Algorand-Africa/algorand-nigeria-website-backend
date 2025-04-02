import { Event } from 'src/dal/entities';
import { EventDto } from '../dto/event.dto';

export const EventDtoMapper = (event: Event): EventDto => {
  return {
    id: event.slug,
    title: event.title,
    description: event.description,
    location: event.location,
    image: event.image,
    date: event.date,
    category: event.category,
    type: event.type,
    status: event.status,
  };
};

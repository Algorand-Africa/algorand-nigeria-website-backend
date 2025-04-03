import { Event } from 'src/dal/entities';
import {
  AdminEventDetailsDto,
  AdminEventDto,
  EventDetailsDto,
  EventDto,
} from '../dto/event.dto';

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

export const EventDetailsDtoMapper = (event: Event): EventDetailsDto => {
  return {
    ...EventDtoMapper(event),
    eventSummary: event.event_summary,
    imageGallery: event.image_gallery,
  };
};

export const AdminEventDtoMapper = (
  event: Event & { registrations: number; attendees: number },
): AdminEventDto => {
  return {
    ...EventDtoMapper(event),
    id: event.id,
    eventSummary: event.event_summary,
    imageGallery: event.image_gallery,
    numberOfRegistrations: event.registrations,
    numberOfAttendees: event.attendees,
  };
};

export const AdminEventDetailsDtoMapper = (
  event: Event & { registrations: number; attendees: number },
): AdminEventDetailsDto => {
  return {
    ...AdminEventDtoMapper(event),
    smartContractId: event.smart_contract_id,
    asaId: event.asa_id,
  };
};

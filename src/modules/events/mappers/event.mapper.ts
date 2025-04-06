import { Event } from 'src/dal/entities';
import {
  AdminEventDetailsDto,
  AdminEventDto,
  EventDetailsDto,
  EventDto,
} from '../dto/event.dto';
import { UserEventStatus } from '../constants/enums';
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

export const EventDetailsDtoMapper = (
  event: Event,
  userStatus?: UserEventStatus,
): EventDetailsDto => {
  return {
    ...EventDtoMapper(event),
    eventSummary: event.event_summary,
    imageGallery: event.image_gallery,
    userStatus,
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
    attendanceLink: event.attendance_link,
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

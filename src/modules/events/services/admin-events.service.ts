import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Event } from '../../../dal/entities/event.entity';
import { EventRegistration } from '../../../dal/entities/event-registration.entity';
import {
  AllEventsQueryDto,
  AdminEventDto,
  AdminEventDetailsDto,
  EventRegistrantDto,
  CreateEventDto,
  UpdateEventDto,
  EventDetailsDto,
  EventRegistrantsQueryDto,
} from '../dto/event.dto';
import { FileUploadService, PaginatedResponse } from 'src/modules/core';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  startOfQuarter,
  endOfQuarter,
} from 'date-fns';
import {
  AdminEventDtoMapper,
  AdminEventDetailsDtoMapper,
  EventDetailsDtoMapper,
} from '../mappers/event.mapper';
import { EventStatus, UserEventStatus } from '../constants/enums';
import { User } from 'src/dal/entities';
import { convertToUrlFormat } from 'src/modules/core/utils/string';
import { IMAGE_BASE64_REGEX } from 'src/modules/core/constants/base64-regex';

@Injectable()
export class AdminEventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepository: Repository<EventRegistration>,

    private readonly fileUploadService: FileUploadService,
  ) {}

  async getAllEvents(
    options: AllEventsQueryDto,
  ): Promise<PaginatedResponse<AdminEventDto>> {
    const today = new Date();
    const { page, pageSize, category, type, datePeriod, skip, search, status } =
      options;

    const datePeriodMap = {
      TODAY: [startOfDay(today), endOfDay(today)],
      WEEKLY: [startOfWeek(today), endOfWeek(today)],
      MONTHLY: [startOfMonth(today), endOfMonth(today)],
      QUARTERLY: [startOfQuarter(today), endOfQuarter(today)],
      YEARLY: [startOfYear(today), endOfYear(today)],
      ALL: null,
    };

    const period = datePeriodMap[datePeriod];

    const qb = this.eventRepository
      .createQueryBuilder('event')
      .select('event.*')
      .addSelect('COUNT(event_registration.id)', 'registrations')
      .addSelect('COUNT(event_attendance.id)', 'attendees')
      .leftJoin(
        EventRegistration,
        'event_registration',
        'event_registration.event_id = event.id',
      )
      .leftJoin(
        EventRegistration,
        'event_attendance',
        'event_attendance.event_id = event.id AND event_attendance.status = :status',
        { status: UserEventStatus.ATTENDED },
      )
      .groupBy('event.id');

    if (status) {
      qb.andWhere('event.status = :status', { status });
    }

    if (category) {
      qb.andWhere('event.category = :category', { category });
    }

    if (type) {
      qb.andWhere('event.type = :type', { type });
    }

    if (period) {
      qb.andWhere('event.date BETWEEN :start AND :end', {
        start: period[0],
        end: period[1],
      });
    }

    if (search) {
      qb.andWhere('event.title ILIKE :search', { search: `%${search}%` });
    }

    qb.offset(skip).limit(pageSize);

    const [data, total] = await Promise.all([qb.getRawMany(), qb.getCount()]);

    return new PaginatedResponse(
      data.map(AdminEventDtoMapper),
      total,
      page,
      pageSize,
    );
  }

  async getEventById(eventId: string): Promise<AdminEventDetailsDto> {
    const qb = this.eventRepository
      .createQueryBuilder('event')
      .select('event.*')
      .addSelect('COUNT(event_registration.id)', 'registrations')
      .addSelect('COUNT(event_attendance.id)', 'attendees')
      .leftJoin(
        EventRegistration,
        'event_registration',
        'event_registration.event_id = event.id',
      )
      .leftJoin(
        EventRegistration,
        'event_attendance',
        'event_attendance.event_id = event.id AND event_attendance.status = :status',
        { status: UserEventStatus.ATTENDED },
      )
      .where('event.id = :id', { id: eventId })
      .groupBy('event.id');

    const event = await qb.getRawOne();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return AdminEventDetailsDtoMapper(event);
  }

  async getEventRegistrants(
    eventId: string,
    options: EventRegistrantsQueryDto,
  ): Promise<PaginatedResponse<EventRegistrantDto>> {
    const { page, pageSize, skip, status } = options;

    const qb = this.eventRegistrationRepository
      .createQueryBuilder('event_registration')
      .select(['u.id', 'u.full_name', 'u.email'])
      .where(`event_registration.event_id = '${eventId}'`)
      .leftJoin(User, 'u', 'u.id = event_registration.user_id');

    if (status) {
      qb.andWhere('event_registration.status = :status', { status });
    }

    qb.offset(skip).limit(pageSize);

    const [data, total] = await Promise.all([qb.getRawMany(), qb.getCount()]);

    return new PaginatedResponse(
      data.map((registrant: any) => ({
        id: registrant.u_id,
        fullName: registrant.u_full_name,
        email: registrant.u_email,
      })),
      total,
      page,
      pageSize,
    );
  }

  async createEvent(dto: CreateEventDto): Promise<AdminEventDto> {
    const { title, description, location, base64Image, date, category, type } =
      dto;

    const existingTitle = await this.eventRepository.findOne({
      where: { title },
    });

    if (existingTitle) {
      throw new BadRequestException('Event title already exists');
    }

    const slug = convertToUrlFormat(title);

    const image = await this.fileUploadService.uploadToCloudinary(
      base64Image,
      null,
      'events',
    );

    const event = this.eventRepository.create({
      title,
      description,
      location,
      date,
      category,
      type,
      image: image.image,
      slug,
      status: EventStatus.UPCOMING,
    });

    await this.eventRepository.save(event);

    return AdminEventDtoMapper({
      ...event,
      registrations: 0,
      attendees: 0,
    });
  }

  async updateEvent(
    eventId: string,
    dto: UpdateEventDto,
  ): Promise<EventDetailsDto> {
    const {
      title,
      description,
      location,
      image,
      date,
      category,
      type,
      eventSummary,
      imageGallery,
    } = dto;

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.title !== title) {
      const existingTitle = await this.eventRepository.findOne({
        where: { title, id: Not(eventId) },
      });

      if (existingTitle) {
        throw new BadRequestException('Event title already exists');
      }

      event.title = title;
      event.slug = convertToUrlFormat(title);
    }

    if (description) {
      event.description = description;
    }

    if (location) {
      event.location = location;
    }

    if (image) {
      event.image = image;
    }

    if (date) {
      event.date = date;
    }

    if (category) {
      event.category = category;
    }

    if (type) {
      event.type = type;
    }

    if (eventSummary) {
      event.event_summary = eventSummary;
    }

    if (imageGallery.length > 0) {
      event.image_gallery = [];
      for (const image of imageGallery) {
        const isBase64 = image.match(IMAGE_BASE64_REGEX);

        if (isBase64) {
          const uploadedImage = await this.fileUploadService.uploadToCloudinary(
            image,
            null,
            'events',
          );

          event.image_gallery.push(uploadedImage.image);
        } else {
          event.image_gallery.push(image);
        }
      }
    }

    await this.eventRepository.save(event);

    return EventDetailsDtoMapper(event);
  }

  async deleteEvent(eventId: string): Promise<{ message: string }> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.eventRepository.delete(eventId);

    return {
      message: 'Event deleted successfully',
    };
  }
}

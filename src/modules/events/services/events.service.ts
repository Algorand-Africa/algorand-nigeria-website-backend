import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../../dal/entities/event.entity';
import { EventRegistration } from '../../../dal/entities/event-registration.entity';
import { AllEventsQueryDto, EventDetailsDto, EventDto } from '../dto/event.dto';
import { PaginatedResponse } from 'src/modules/core';
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
import { EventDetailsDtoMapper, EventDtoMapper } from '../mappers/event.mapper';
import { EventStatus, UserEventStatus } from '../constants/enums';
import { isUUID } from 'class-validator';
import { SendgridService } from 'src/modules/core/services/sendgrid/sendgrid.service';
import { User } from 'src/dal/entities';
import { SORT_ORDER } from 'src/modules/core/dto/page-options.dto';
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepository: Repository<EventRegistration>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly sendgridService: SendgridService,
  ) {}

  async getAllEvents(
    options: AllEventsQueryDto,
  ): Promise<PaginatedResponse<EventDto>> {
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

    const qb = this.eventRepository.createQueryBuilder('event');

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

    qb.orderBy('event.date', SORT_ORDER.DESC);

    qb.skip(skip).take(pageSize);

    const [data, total] = await qb.getManyAndCount();

    return new PaginatedResponse(
      data.map(EventDtoMapper),
      total,
      page,
      pageSize,
    );
  }

  async getEventById(
    eventId: string,
    userId?: string,
  ): Promise<EventDetailsDto> {
    const where = isUUID(eventId) ? { id: eventId } : { slug: eventId };
    const event = await this.eventRepository.findOne({
      where,
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    let userStatus: UserEventStatus = UserEventStatus.NOT_REGISTERED;

    if (userId) {
      const registration = await this.eventRegistrationRepository.findOne({
        where: { event_id: event.id, user_id: userId },
      });

      if (registration) {
        userStatus = registration.status;
      }
    }

    return EventDetailsDtoMapper(event, userStatus);
  }

  async registerForEvent(eventId: string, userId: string, attendance = false) {
    const where = isUUID(eventId) ? { id: eventId } : { slug: eventId };
    const event = await this.eventRepository.findOne({
      where,
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const registration = await this.eventRegistrationRepository.findOne({
      where: { event_id: event.id, user_id: userId },
    });

    if (registration) {
      throw new BadRequestException('User already registered for this event');
    }

    const newRegistration = this.eventRegistrationRepository.create({
      event_id: event.id,
      user_id: userId,
    });

    await this.eventRegistrationRepository.save(newRegistration);

    if (!attendance && event.rsvp_link) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      await this.sendgridService.sendEventRSVP({
        email: user.email,
        eventName: event.title,
        eventLink: event.rsvp_link,
      });
    }

    const message = attendance
      ? 'Event marked as attended successfully'
      : 'User registered for event successfully';

    return {
      message,
    };
  }

  async markAttendance(userId: string, token: string) {
    const event = await this.eventRepository.findOne({
      where: { attendance_token: token },
    });

    if (!event) {
      throw new BadRequestException('Invalid attendance token');
    }

    if (event.status === EventStatus.PAST) {
      throw new BadRequestException('This event has ended');
    }

    return this.markEventAsAttended(event.id, userId);
  }

  async markCollectedNFT(userId: string, eventId: string) {
    const where = isUUID(eventId) ? { id: eventId } : { slug: eventId };
    const event = await this.eventRepository.findOne({
      where,
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const registration = await this.eventRegistrationRepository.findOne({
      where: { event_id: event.id, user_id: userId },
    });

    if (!registration) {
      throw new BadRequestException('User not registered for this event');
    }

    registration.status = UserEventStatus.COLLECTED_NFT;
    await this.eventRegistrationRepository.save(registration);

    return {
      message: 'NFT marked as collected successfully',
    };
  }

  private async markEventAsAttended(eventId: string, userId: string) {
    let registration: EventRegistration;

    registration = await this.eventRegistrationRepository.findOne({
      where: { event_id: eventId, user_id: userId },
    });

    if (!registration) {
      await this.registerForEvent(eventId, userId);

      registration = await this.eventRegistrationRepository.findOne({
        where: { event_id: eventId, user_id: userId },
      });
    }

    registration.status = UserEventStatus.ATTENDED;
    await this.eventRegistrationRepository.save(registration);

    return {
      message: 'Event marked as attended successfully',
    };
  }
}

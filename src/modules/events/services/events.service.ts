import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../../dal/entities/event.entity';
import { EventRegistration } from '../../../dal/entities/event-registration.entity';
import { AllEventsQueryDto, EventDto } from '../dto/event.dto';
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
import { EventDtoMapper } from '../mappers/event.mapper';
import { EventStatus, UserEventStatus } from '../constants/enums';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepository: Repository<EventRegistration>,
  ) {}

  async getUpcomingEvents(
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

    qb.skip(skip).take(pageSize);

    const [data, total] = await qb.getManyAndCount();

    return new PaginatedResponse(
      data.map(EventDtoMapper),
      total,
      page,
      pageSize,
    );
  }

  async registerForEvent(eventId: string, userId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const registration = await this.eventRegistrationRepository.findOne({
      where: { event_id: eventId, user_id: userId },
    });

    if (registration) {
      throw new BadRequestException('User already registered for this event');
    }

    const newRegistration = this.eventRegistrationRepository.create({
      event_id: eventId,
      user_id: userId,
    });

    await this.eventRegistrationRepository.save(newRegistration);

    return {
      message: 'User registered for event successfully',
    };
  }

  async markEventAsAttended(eventId: string, userId: string) {
    //TODO: Perform validation
    const registration = await this.eventRegistrationRepository.findOne({
      where: { event_id: eventId, user_id: userId },
    });

    if (!registration) {
      return this.registerForEvent(eventId, userId);
    }

    registration.status = UserEventStatus.ATTENDED;
    await this.eventRegistrationRepository.save(registration);

    return {
      message: 'Event marked as attended successfully',
    };
  }
}

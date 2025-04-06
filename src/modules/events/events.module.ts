import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRegistration } from 'src/dal/entities/event-registration.entity';
import { EventsService } from './services/events.service';
import { AdminEventsService } from './services/admin-events.service';
import { Event } from 'src/dal/entities/event.entity';
import { AdminEventsController } from './controllers/admin-events.controller';
import { EventsController } from './controllers/events.controller';
import { AdminUsersService } from 'src/modules/users';
import { User } from 'src/dal/entities';
@Module({
  imports: [TypeOrmModule.forFeature([Event, EventRegistration, User])],
  providers: [EventsService, AdminEventsService, AdminUsersService],
  exports: [EventsService, AdminEventsService],
  controllers: [EventsController, AdminEventsController],
})
export class EventsModule {}

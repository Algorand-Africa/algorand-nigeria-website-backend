import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRegistration } from 'src/dal/entities/event-registration.entity';
import { EventsService } from './services/events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventRegistration])],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

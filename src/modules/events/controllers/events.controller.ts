import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EventsService } from '../services/events.service';
import { AllEventsQueryDto } from '../dto/event.dto';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Public()
  @Get()
  async getUpcomingEvents(@Query() query: AllEventsQueryDto) {
    return this.eventService.getUpcomingEvents(query);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Post(':id/register')
  async registerForEvent(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.eventService.registerForEvent(id, user.id);
  }
}

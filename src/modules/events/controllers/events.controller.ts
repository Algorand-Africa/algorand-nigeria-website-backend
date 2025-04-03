import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EventsService } from '../services/events.service';
import { AllEventsQueryDto, EventDetailsDto, EventDto } from '../dto/event.dto';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Public()
  @ApiOperation({ summary: 'Fetch all events' })
  @ApiResponse({
    status: 200,
    description: 'All events fetched successfully',
    type: EventDto,
  })
  @Get()
  async getAllEvents(@Query() query: AllEventsQueryDto) {
    return this.eventService.getAllEvents(query);
  }

  @Public()
  @ApiOperation({ summary: 'Fetch event by id' })
  @ApiResponse({
    status: 200,
    description: 'Event fetched successfully',
    type: EventDetailsDto,
  })
  @Get(':id')
  async getEventById(@Param('id') id: string) {
    return this.eventService.getEventById(id);
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

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AdminEventDto,
  AllEventsQueryDto,
  CreateEventDto,
  EventDetailsDto,
  EventRegistrantDto,
  EventRegistrantsQueryDto,
  UpdateEventDto,
} from '../dto/event.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards';
import { AdminEventsService } from '../services/admin-events.service';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RoleType } from 'src/modules/users/enums/role-type.enum';

@ApiTags('Events management')
@ApiBearerAuth('Bearer')
@Controller('admin/events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminEventsController {
  constructor(private readonly eventService: AdminEventsService) {}

  @ApiOperation({ summary: 'Fetch all events' })
  @ApiResponse({
    status: 200,
    description: 'All events fetched successfully',
    type: AdminEventDto,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Get()
  async getAllEvents(@Query() query: AllEventsQueryDto) {
    return this.eventService.getAllEvents(query);
  }

  @ApiOperation({ summary: 'Get registrants for an event' })
  @ApiResponse({
    status: 200,
    description: 'Registrants fetched successfully',
    type: EventRegistrantDto,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Get(':id/registrants')
  async getEventRegistrants(
    @Param('id') id: string,
    @Query() query: EventRegistrantsQueryDto,
  ) {
    return this.eventService.getEventRegistrants(id, query);
  }

  @ApiOperation({ summary: 'Fetch event by id' })
  @ApiResponse({
    status: 200,
    description: 'Event fetched successfully',
    type: EventDetailsDto,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Get(':id')
  async getEventById(@Param('id') id: string) {
    return this.eventService.getEventById(id);
  }

  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: AdminEventDto,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Post()
  async createEvent(@Body() dto: CreateEventDto) {
    return this.eventService.createEvent(dto);
  }

  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    type: EventDetailsDto,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Put(':id')
  async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventService.updateEvent(id, dto);
  }

  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully',
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
}

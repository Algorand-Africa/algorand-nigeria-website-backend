import { ApiProperty } from '@nestjs/swagger';
import { EventCategory, EventStatus, EventType } from '../constants/enums';
import { PaginationParams } from 'src/modules/core/dto/pagination-params.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { DATE_PERIOD } from 'src/modules/core/constants/dates';

export class EventDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ enum: EventCategory })
  category: EventCategory;

  @ApiProperty({ enum: EventType })
  type: EventType;

  @ApiProperty({ enum: EventStatus })
  status: EventStatus;
}

export class AllEventsQueryDto extends PaginationParams {
  @ApiProperty({ enum: EventCategory })
  @IsOptional()
  @IsEnum(EventCategory)
  category: EventCategory;

  @ApiProperty({ enum: EventType })
  @IsOptional()
  @IsEnum(EventType)
  type: EventType;

  @ApiProperty({ enum: DATE_PERIOD, default: DATE_PERIOD.ALL })
  @IsEnum(DATE_PERIOD)
  @IsOptional()
  datePeriod?: DATE_PERIOD = DATE_PERIOD.ALL;

  @ApiProperty({ enum: EventStatus })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}

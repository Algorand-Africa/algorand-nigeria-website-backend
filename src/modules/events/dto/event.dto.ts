import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EventCategory,
  EventStatus,
  EventType,
  UserEventStatus,
} from '../constants/enums';
import { PaginationParams } from 'src/modules/core/dto/pagination-params.dto';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateIf,
} from 'class-validator';
import { DATE_PERIOD } from 'src/modules/core/constants/dates';
import { IMAGE_BASE64_REGEX } from 'src/modules/core/constants/base64-regex';

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

export class EventDetailsDto extends EventDto {
  @ApiProperty()
  eventSummary: string;

  @ApiProperty()
  imageGallery: string[];
}

export class AdminEventDto extends EventDto {
  @ApiProperty()
  eventSummary: string;

  @ApiProperty()
  imageGallery: string[];

  @ApiProperty()
  numberOfRegistrations: number;

  @ApiProperty()
  numberOfAttendees: number;
}

export class AdminEventDetailsDto extends AdminEventDto {
  @ApiProperty()
  smartContractId: number;

  @ApiProperty()
  asaId: number;
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

export class EventRegistrantDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  email: string;
}

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(IMAGE_BASE64_REGEX, {
    message: 'Image must be a base64 string',
  })
  base64Image: string;

  @ApiProperty()
  @IsDateString()
  date: Date;

  @ApiProperty({ enum: EventCategory })
  @IsEnum(EventCategory)
  category: EventCategory;

  @ApiProperty({ enum: EventType })
  @IsEnum(EventType)
  type: EventType;
}

export class UpdateEventDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  date: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image: string;

  @ApiPropertyOptional({ enum: EventCategory })
  @IsEnum(EventCategory)
  @IsOptional()
  category: EventCategory;

  @ApiPropertyOptional({ enum: EventType })
  @IsEnum(EventType)
  @IsOptional()
  type: EventType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  eventSummary: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  imageGallery: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @ValidateIf((object) => object.asaId !== null || object.asaId !== undefined)
  smartContractId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @ValidateIf(
    (object) =>
      object.smartContractId !== null || object.smartContractId !== undefined,
  )
  asaId: string;
}

export class EventRegistrantsQueryDto extends PaginationParams {
  @ApiProperty({ enum: UserEventStatus })
  @IsEnum(UserEventStatus)
  @IsOptional()
  status?: UserEventStatus;
}

export class GenerateAttendanceTokenDto {
  @ApiProperty()
  @IsString()
  eventId: string;

  @ApiProperty()
  @IsUrl()
  prefixUrl: string;
}

export class GenerateAttendanceTokenResponseDto {
  @ApiProperty()
  attendanceLink: string;
}

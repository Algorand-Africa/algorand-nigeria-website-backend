import { ApiProperty } from '@nestjs/swagger';
import { RequestDto } from './request.dto';
import { PageOptionsDto, PageOptionsWithSearchDto } from './page.dto';
import { IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { DATE_PERIOD } from '../enums/date-period.enum';

export class CreateAdminActivityDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty({
    type: RequestDto,
  })
  request: RequestDto;
}

export class AdminActivityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  adminId: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  method: string;

  @ApiProperty()
  headers: any;

  @ApiProperty()
  payload: any;

  @ApiProperty()
  adminName: string;

  @ApiProperty()
  adminImage: string;

  @ApiProperty()
  adminEmail: string;
}

export class AdminActivityPaginationDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly numOfItemsPerPage: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  @ApiProperty({ type: AdminActivityDto, isArray: true })
  data: AdminActivityDto[];
}

export class AdminActivityPageOptionsDto extends PageOptionsDto {
  @ApiProperty({ required: false })
  adminId?: string;

  @ApiProperty({ required: false })
  searchTerm?: string;

  @ApiProperty({ required: false })
  startDate?: Date;

  @ApiProperty({ required: false })
  endDate?: Date;
}

export class DownloadAdminActivityLogDto extends PageOptionsWithSearchDto {
  @ApiProperty({ required: false })
  adminId?: string;

  @ApiProperty({ enum: DATE_PERIOD, default: DATE_PERIOD.ALL })
  @IsEnum(DATE_PERIOD)
  @IsOptional()
  datePeriod?: DATE_PERIOD = DATE_PERIOD.TODAY;

  @ApiProperty({ enum: ['csv', 'pdf'] })
  @IsEnum(['csv', 'pdf'])
  @IsNotEmpty({ message: 'Please select a format to download the file.' })
  format: 'csv' | 'pdf';
}

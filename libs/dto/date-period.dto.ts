import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DATE_PERIOD } from '../enums/date-period.enum';

export class DatePeriodDto {
  @ApiProperty({ enum: DATE_PERIOD, default: DATE_PERIOD.TODAY })
  @IsEnum(DATE_PERIOD)
  @IsOptional()
  readonly datePeriod: DATE_PERIOD = DATE_PERIOD.TODAY;
}

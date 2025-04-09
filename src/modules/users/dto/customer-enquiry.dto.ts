import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { EnquiryStatus } from '../enums/enquiry-status.enum';
import { PaginationParams } from 'src/modules/core/dto/pagination-params.dto';

export class CustomerEnquiryDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsString()
  enquiryType: string;

  @ApiProperty()
  @IsString()
  status: string;
}

export class CreateCustomerEnquiryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  message: string;

  @ApiPropertyOptional()
  @IsString()
  enquiryType: string;
}

export class UpdateCustomerEnquiryDto {
  @ApiProperty({ enum: EnquiryStatus })
  @IsEnum(EnquiryStatus)
  status: EnquiryStatus;
}

export class CustomerEnquiryQueryDto extends PaginationParams {
  @ApiPropertyOptional()
  @IsEnum(EnquiryStatus)
  @IsOptional()
  status?: EnquiryStatus;
}

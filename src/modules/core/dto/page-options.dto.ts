import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum SORT_ORDER {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  readonly take: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SORT_ORDER)
  readonly sort_dir: SORT_ORDER = SORT_ORDER.DESC;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly sort_by: string = 'created_at';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly search_term?: string;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}

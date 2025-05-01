import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CategoryVisibility } from 'src/dal/entities/forum-category.entity';
import { PaginationParams } from 'src/modules/core/dto/pagination-params.dto';

export class AdminCategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  textColor: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty({
    enum: CategoryVisibility,
  })
  visibility: CategoryVisibility;

  @ApiProperty()
  totalPosts: number;
}

export class CategoryDto {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  textColor: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  totalPosts: number;
}

export class AdminFetchPostsQueryDto extends PaginationParams {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
}

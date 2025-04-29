import { ApiProperty } from '@nestjs/swagger';
import { CategoryVisibility } from 'src/dal/entities/forum-category.entity';

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

import { ApiProperty } from '@nestjs/swagger';
import { CategoryVisibility } from 'src/dal/entities/forum-category.entity';

export class CategoryDto {
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
  image: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty({
    enum: CategoryVisibility,
  })
  visibility: CategoryVisibility;
}

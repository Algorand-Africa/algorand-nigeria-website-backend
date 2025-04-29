import { ApiProperty } from '@nestjs/swagger';

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
}

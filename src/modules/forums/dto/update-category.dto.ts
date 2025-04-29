import { IsString, IsOptional, Matches, IsEnum } from 'class-validator';
import { CategoryVisibility } from 'src/dal/entities/forum-category.entity';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsEnum(CategoryVisibility)
  @IsOptional()
  visibility?: CategoryVisibility;
}

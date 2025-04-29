import { IsString, IsOptional, IsEnum, IsUUID, Matches } from 'class-validator';
import { CategoryVisibility } from 'src/dal/entities/forum-category.entity';
import { IMAGE_BASE64_REGEX } from 'src/modules/core/constants/base64-regex';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @Matches(IMAGE_BASE64_REGEX)
  @IsOptional()
  base64Image?: string;

  @IsEnum(CategoryVisibility)
  @IsOptional()
  visibility?: CategoryVisibility;
}

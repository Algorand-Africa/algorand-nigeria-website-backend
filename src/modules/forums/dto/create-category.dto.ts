import { IsString, IsOptional, IsEnum, Matches } from 'class-validator';
import { CategoryVisibility } from 'src/dal/entities/forum-category.entity';
import { IMAGE_BASE64_REGEX } from 'src/modules/core/constants/base64-regex';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  color: string;

  @IsString()
  textColor: string;

  @IsString()
  @Matches(IMAGE_BASE64_REGEX, {
    message: 'Invalid image',
  })
  base64Image: string;

  @IsEnum(CategoryVisibility)
  visibility: CategoryVisibility;
}

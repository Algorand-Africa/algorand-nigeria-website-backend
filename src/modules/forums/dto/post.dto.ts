import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '../enum/post-status.enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { IMAGE_BASE64_REGEX } from 'src/modules/core/constants/base64-regex';
import { PaginationParams } from 'src/modules/core/dto/pagination-params.dto';

export class PostPreviewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  categoryColor: string;

  @ApiProperty()
  categoryTextColor: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  numberOfComments: number;

  @ApiProperty()
  numberOfUpVotes: number;

  @ApiProperty()
  posterUsername: string;

  @ApiProperty()
  posterAvatar: string;

  @ApiProperty({ enum: PostStatus })
  status: PostStatus;

  @ApiProperty()
  image: string;

  @ApiProperty()
  upVoted: boolean;

  @ApiProperty()
  downVoted: boolean;

  @ApiProperty()
  saved: boolean;
}

export class PostDto extends PostPreviewDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  images: string[];
}

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  @IsArray()
  @Matches(IMAGE_BASE64_REGEX, {
    each: true,
    message: 'Invalid image',
  })
  images: string[];
}

export class AdminPostDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  numberOfComments: number;

  @ApiProperty()
  numberOfUpVotes: number;

  @ApiProperty()
  numberOfDownVotes: number;

  @ApiProperty()
  numberOfSaved: number;

  @ApiProperty({ enum: PostStatus })
  status: PostStatus;

  @ApiProperty()
  posterEmail: string;

  @ApiProperty()
  posterUsername: string;

  @ApiProperty()
  posterAvatar: string;

  @ApiProperty()
  images: string[];

  @ApiProperty()
  message: string;
}

export class UpdatePostStatusDto {
  @ApiProperty({ enum: PostStatus })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;
}

export class FetchPostsQueryDto extends PaginationParams {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ enum: ['createdAt', 'numberOfComments'] })
  @IsOptional()
  @IsEnum(['createdAt', 'numberOfComments'])
  sortBy?: 'createdAt' | 'numberOfComments';
}

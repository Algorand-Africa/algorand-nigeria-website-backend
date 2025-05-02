import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsString } from 'class-validator';

export class CommentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  message: string;

  @ApiProperty()
  numberOfUpVotes: number;

  @ApiProperty()
  posterUsername: string;

  @ApiProperty()
  posterAvatar: string;

  @ApiProperty()
  upVoted: boolean;

  @ApiProperty()
  downVoted: boolean;

  @ApiPropertyOptional()
  parentId?: string;

  @ApiPropertyOptional()
  comments?: CommentDto[];

  @ApiProperty()
  deleted: boolean;
}

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  parentCommentId?: string;
}

export class AdminCommentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  message: string;

  @ApiProperty()
  numberOfUpVotes: number;

  @ApiProperty()
  numberOfDownVotes: number;

  @ApiProperty()
  posterUsername: string;

  @ApiProperty()
  posterAvatar: string;

  @ApiProperty()
  posterEmail: string;

  @ApiPropertyOptional()
  parentId?: string;

  @ApiPropertyOptional()
  comments?: AdminCommentDto[];

  @ApiProperty()
  deleted: boolean;
}

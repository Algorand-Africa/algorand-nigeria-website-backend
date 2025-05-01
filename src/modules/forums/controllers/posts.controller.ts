import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostsService } from '../services/posts.service';
import { CategoryDto } from '../dto/category.dto';
import { PaginationParams } from 'src/modules/core/dto/pagination-params.dto';
import {
  CreatePostDto,
  FetchPostsQueryDto,
  PostDto,
  PostPreviewDto,
} from '../dto/post.dto';
import { OptionalJwtGuard } from 'src/modules/auth/guards/optional-jwt.guard';
import { CurrentUser } from 'src/modules/auth/decorators';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { PaginatedResponse } from 'src/modules/core';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CommentDto, CreateCommentDto } from '../dto/comment.dto';

@ApiTags('Forum Posts')
@Controller('forum/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @ApiOperation({ summary: 'Fetch all categories' })
  @ApiResponse({
    status: 200,
    description: 'All categories fetched successfully',
    type: CategoryDto,
  })
  @Get('categories')
  findAll(
    @Query() options: PaginationParams,
  ): Promise<PaginatedResponse<CategoryDto>> {
    return this.postsService.fetchAllCategories(options);
  }

  @UseGuards(OptionalJwtGuard())
  @ApiOperation({ summary: 'Fetch all post previews under a category' })
  @ApiResponse({
    status: 200,
    description: 'All post previews fetched successfully',
    type: PostPreviewDto,
  })
  @Get('previews')
  fetchPostPreviews(
    @Query() options: FetchPostsQueryDto,
    @CurrentUser() user: { id: string },
  ): Promise<PaginatedResponse<PostPreviewDto>> {
    return this.postsService.fetchPostPreviews(options, user?.id);
  }

  @UseGuards(OptionalJwtGuard())
  @ApiOperation({ summary: 'Fetch a post by id' })
  @ApiResponse({
    status: 200,
    description: 'Post fetched successfully',
    type: PostDto,
  })
  @Get(':id')
  fetchPost(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ): Promise<PostDto> {
    return this.postsService.fetchPost(id, user?.id);
  }

  @UseGuards(OptionalJwtGuard())
  @ApiOperation({ summary: 'Fetch all comments under a post' })
  @ApiResponse({
    status: 200,
    description: 'All comments fetched successfully',
    type: CommentDto,
  })
  @Get(':id/comments')
  fetchCommentsUnderPost(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ): Promise<CommentDto[]> {
    return this.postsService.fetchCommentsUnderPost(id, user?.id);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostDto,
  })
  @Post()
  createPost(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: { id: string },
  ): Promise<PostDto> {
    return this.postsService.createPost(createPostDto, user?.id);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: CommentDto,
  })
  @Post('comment')
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: { id: string },
  ): Promise<CommentDto> {
    return this.postsService.postComment(createCommentDto, user?.id);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Save a post' })
  @ApiResponse({
    status: 200,
    description: 'Post saved successfully',
  })
  @Post('save/:id/post')
  savePost(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.postsService.savePost(id, user?.id);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upvote a post' })
  @ApiResponse({
    status: 200,
    description: 'Post upvoted successfully',
  })
  @Post('upvote/:id/post')
  upvotePost(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.postsService.upvotePost(id, user?.id);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Downvote a post' })
  @ApiResponse({
    status: 200,
    description: 'Post downvoted successfully',
  })
  @Post('downvote/:id/post')
  downvotePost(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.postsService.downvotePost(id, user?.id);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upvote a comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment upvoted successfully',
  })
  @Post('upvote/:id/comment')
  upvoteComment(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.postsService.upvoteComment(id, user?.id);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Downvote a comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment downvoted successfully',
  })
  @Post('downvote/:id/comment')
  downvoteComment(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.postsService.downvoteComment(id, user?.id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminCategoriesService as CategoriesService } from '../services/admin-categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ForumCategory } from 'src/dal/entities/forum-category.entity';
import {
  AdminFetchPostsQueryDto,
  AdminCategoryDto as CategoryDto,
} from '../dto/category.dto';
import { RoleType } from 'src/modules/users/enums/role-type.enum';
import { PaginationParams } from 'src/modules/core/dto/pagination-params.dto';
import { PaginatedResponse } from 'src/modules/core/dto/paginated-response.dto';
import { User } from 'src/modules/core/decorators/user.decorator';
import { ObjectIdDto } from 'src/modules/core/dto/object-id.dto';
import { AdminPostDto, UpdatePostStatusDto } from '../dto/post.dto';
import { AdminCommentDto } from '../dto/comment.dto';
import { Post as PostEntity } from 'src/dal/entities';

@ApiTags('Forum Categories management')
@ApiBearerAuth('Bearer')
@Controller('admin/forum-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: ForumCategory,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User() user: ObjectIdDto,
  ): Promise<ForumCategory> {
    return this.categoriesService.create(createCategoryDto, user.id);
  }

  @ApiOperation({ summary: 'Fetch all categories' })
  @ApiResponse({
    status: 200,
    description: 'All categories fetched successfully',
    type: CategoryDto,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Get()
  findAll(
    @Query() options: PaginationParams,
  ): Promise<PaginatedResponse<CategoryDto>> {
    return this.categoriesService.findAll(options);
  }

  @ApiOperation({ summary: 'Fetch posts under a category' })
  @ApiResponse({
    status: 200,
    description: 'Posts fetched successfully',
    type: AdminPostDto,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Get(':id/posts')
  fetchPosts(
    @Param('id') id: string,
    @Query() options: AdminFetchPostsQueryDto,
  ): Promise<PaginatedResponse<AdminPostDto>> {
    return this.categoriesService.fetchPosts(options, id);
  }

  @ApiOperation({ summary: 'Fetch comments under a post' })
  @ApiResponse({
    status: 200,
    description: 'Comments fetched successfully',
    type: AdminCommentDto,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Get(':id/comments')
  fetchComments(@Param('id') id: string): Promise<AdminCommentDto[]> {
    return this.categoriesService.fetchComments(id);
  }

  @ApiOperation({ summary: 'Fetch category by id' })
  @ApiResponse({
    status: 200,
    description: 'Category fetched successfully',
    type: CategoryDto,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<CategoryDto> {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a post status' })
  @ApiResponse({
    status: 200,
    description: 'The post status has been successfully updated.',
    type: PostEntity,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Patch(':postId/status')
  updatePostStatus(
    @Param('postId') postId: string,
    @Body() updatePostStatusDto: UpdatePostStatusDto,
  ): Promise<PostEntity> {
    return this.categoriesService.updatePostStatus(postId, updatePostStatusDto);
  }

  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
    type: ForumCategory,
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ForumCategory> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully deleted.',
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Delete(':commentId/comments')
  deleteComment(
    @Param('commentId') commentId: string,
  ): Promise<{ message: string }> {
    return this.categoriesService.deleteComment(commentId);
  }

  @ApiOperation({ summary: 'Restore a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully restored.',
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Patch(':commentId/comments/restore')
  restoreComment(
    @Param('commentId') commentId: string,
  ): Promise<{ message: string }> {
    return this.categoriesService.restoreComment(commentId);
  }

  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully deleted.',
  })
  @Roles(RoleType.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoriesService.remove(id);
  }
}

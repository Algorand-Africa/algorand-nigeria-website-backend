import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { slugify } from '../../../utils/slugify';
import { ForumCategory as Category } from 'src/dal/entities/forum-category.entity';
import { FileUploadService } from 'src/modules/core';
import {
  AdminFetchPostsQueryDto,
  AdminCategoryDto as CategoryDto,
} from '../dto/category.dto';
import { PaginationParams } from 'src/modules/core/dto/pagination-params.dto';
import { PaginatedResponse } from 'src/modules/core/dto/paginated-response.dto';
import { IMAGE_BASE64_REGEX } from 'src/modules/core/constants/base64-regex';
import { AdminPostDto, UpdatePostStatusDto } from '../dto/post.dto';
import {
  Post,
  User,
  ForumCategory,
  Comment,
  PostVote,
  PostImage,
  SavedPost,
  CommentVote,
} from 'src/dal/entities';
import { VoteType } from '../enum/vote-type.enum';
import { AdminCommentDto } from '../dto/comment.dto';
import { cleanSqlString } from 'src/utils/clean-string';
import { SocketGateway } from 'src/modules/core/providers/socket.provider';

@Injectable()
export class AdminCategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,

    @InjectRepository(Post)
    private postsRepository: Repository<Post>,

    private readonly fileUploadService: FileUploadService,

    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,

    @InjectRepository(CommentVote)
    private readonly commentVotesRepository: Repository<CommentVote>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectEntityManager()
    private readonly manager: EntityManager,

    private readonly socketGateway: SocketGateway,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const slug = slugify(createCategoryDto.name);

    // Check if slug already exists
    const existingCategory = await this.categoriesRepository.findOne({
      where: { slug },
    });

    if (existingCategory) {
      throw new BadRequestException(
        `Category with slug "${slug}" already exists`,
      );
    }

    const image = await this.fileUploadService.uploadToCloudinary(
      createCategoryDto.base64Image,
      null,
      'categories',
    );

    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      text_color: createCategoryDto.textColor,
      image: image.image,
      slug,
      creator_id: userId,
    });

    return this.categoriesRepository.save(category);
  }

  async findAll(
    options: PaginationParams,
  ): Promise<PaginatedResponse<CategoryDto>> {
    const { page, pageSize, skip, search } = options;

    const qb = this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoin('users', 'users', 'users.id::text = category.creator_id')
      .select([
        'category.id as id',
        'category.name as name',
        'category.description as description',
        'category.color as color',
        'category.image as image',
        'category.slug as slug',
        'category.text_color as "textColor"',
        'users.email as "createdBy"',
        'category.visibility as visibility',
      ])
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select('COUNT(*)')
            .from(Post, 'p')
            .where('p.category_id = category.id::text'),
        'totalPosts',
      );

    if (search) {
      qb.andWhere('category.name ILIKE :search', { search: `%${search}%` });
    }

    qb.offset(skip).limit(pageSize);

    const [categories, total] = await Promise.all([
      qb.getRawMany(),
      qb.getCount(),
    ]);

    return new PaginatedResponse(
      categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
        image: category.image,
        slug: category.slug,
        createdBy: category.createdBy,
        visibility: category.visibility,
        textColor: category.textColor,
        totalPosts: parseInt(category.totalPosts),
      })),
      total,
      page,
      pageSize,
    );
  }

  async findOne(id: string): Promise<CategoryDto> {
    const category = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoin('users', 'users', 'users.id::text = category.creator_id')
      .select([
        'category.id as id',
        'category.name as name',
        'category.description as description',
        'category.color as color',
        'category.image as image',
        'users.email as "createdBy"',
        'category.slug as slug',
        'category.visibility as visibility',
        'category.text_color as "textColor"',
      ])
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select('COUNT(*)')
            .from(Post, 'p')
            .where('p.category_id = category.id::text'),
        'totalPosts',
      )
      .where('category.id = :id', { id })
      .getRawOne();

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
      image: category.image,
      slug: category.slug,
      createdBy: category.createdBy,
      visibility: category.visibility,
      textColor: category.textColor,
      totalPosts: parseInt(category.totalPosts),
    };
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    let slug = category.slug;

    // If name is being updated
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      slug = slugify(updateCategoryDto.name);
    }

    let existingImage = category.image;

    const { image, textColor } = updateCategoryDto;

    if (image && IMAGE_BASE64_REGEX.test(image)) {
      const uploadedImage = await this.fileUploadService.uploadToCloudinary(
        image,
        null,
        'categories',
      );
      existingImage = uploadedImage.image;
    }

    Object.assign(category, {
      ...updateCategoryDto,
      image: existingImage,
      slug,
      text_color: textColor,
    });
    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<{ message: string }> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });
    await this.categoriesRepository.remove(category);

    return {
      message: 'Category deleted successfully',
    };
  }

  async fetchPosts(
    options: AdminFetchPostsQueryDto,
    categoryId: string,
  ): Promise<PaginatedResponse<AdminPostDto>> {
    const { page, pageSize, skip, search, userId } = options;

    const qb = this.postsRepository
      .createQueryBuilder('p')
      .select([
        'p.*',
        'u.username as "posterUsername"',
        'u.profile_picture_url as "posterAvatar"',
        'u.email as "posterEmail"',
      ])
      .leftJoin(User, 'u', 'u.id::text = p.poster_id')
      .leftJoin(ForumCategory, 'c', 'c.id::text = p.category_id')
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select('COUNT(*)')
            .from(Comment, 'c')
            .where('c.post_id = p.id::text'),
        'numberOfComments',
      )
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select('COUNT(*)')
            .from(PostVote, 'pv')
            .where('pv.post_id = p.id::text')
            .andWhere(`pv.vote_type = '${VoteType.UPVOTE}'`),
        'numberOfUpVotes',
      )
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select('COUNT(*)')
            .from(PostVote, 'pv')
            .where('pv.post_id = p.id::text')
            .andWhere(`pv.vote_type = '${VoteType.DOWNVOTE}'`),
        'numberOfDownVotes',
      )
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select('COUNT(*)')
            .from(SavedPost, 'sp')
            .where('sp.post_id = p.id::text'),
        'numberOfSaved',
      )
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select('ARRAY_AGG(pm.image_url)')
            .from(PostImage, 'pm')
            .where('pm.post_id = p.id::text')
            .orderBy('pm.created_at', 'ASC')
            .groupBy('pm.created_at'),
        'images',
      );

    if (userId) {
      qb.andWhere('p.poster_id = :userId', { userId });
    }

    if (categoryId) {
      qb.andWhere('c.slug = :categoryId OR c.id::text = :categoryId', {
        categoryId,
      });
    }

    if (search) {
      qb.andWhere('p.title ILIKE :search', { search: `%${search}%` });
    }

    qb.offset(skip)
      .limit(pageSize)
      .orderBy('p.created_at', 'DESC')
      .groupBy(
        'p.created_at, p.id, u.username, u.email, u.profile_picture_url',
      );

    const [posts, total] = await Promise.all([qb.getRawMany(), qb.getCount()]);

    return new PaginatedResponse(
      posts.map((post) => ({
        id: post.id,
        title: post.title,
        message: post.message,
        createdAt: post.created_at,
        numberOfComments: parseInt(post.numberOfComments),
        numberOfUpVotes: parseInt(post.numberOfUpVotes),
        numberOfDownVotes: parseInt(post.numberOfDownVotes),
        numberOfSaved: parseInt(post.numberOfSaved),
        posterEmail: post.posterEmail,
        posterUsername: post.posterUsername,
        posterAvatar: post.posterAvatar,
        status: post.status,
        images: post.images,
      })),
      total,
      page,
      pageSize,
    );
  }

  async fetchComments(postId: string): Promise<AdminCommentDto[]> {
    const comments = await this.getRawComments(postId);
    return this.buildCommentTree(comments);
  }

  async updatePostStatus(
    postId: string,
    updatePostStatusDto: UpdatePostStatusDto,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException(`Post with ID "${postId}" not found`);
    }

    post.status = updatePostStatusDto.status;
    const res = await this.postsRepository.save(post);

    this.socketGateway.emitEvent('post-updated', {
      postId: postId,
    });

    return res;
  }

  async deleteComment(commentId: string): Promise<{ message: string }> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID "${commentId}" not found`);
    }

    await this.commentsRepository.update(comment.id, {
      deleted_at: new Date(),
    });

    this.socketGateway.emitEvent('post-updated', {
      postId: comment.post_id,
    });

    return {
      message: 'Comment deleted successfully',
    };
  }

  async restoreComment(commentId: string): Promise<{ message: string }> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID "${commentId}" not found`);
    }

    await this.commentsRepository.update(commentId, {
      deleted_at: null,
    });

    this.socketGateway.emitEvent('post-updated', {
      postId: comment.post_id,
    });

    return { message: 'Comment restored successfully' };
  }

  private async getRawComments(postId: string): Promise<AdminCommentDto[]> {
    const comments = await this.manager.query(`
        WITH RECURSIVE ordered_roots AS (
            SELECT
                c.id as id,
                c.created_at as "createdAt",
                c.message as message,
                c.parent_id as "parentId",
                c.deleted_at as "deletedAt",
                u.username as "posterUsername",
                u.profile_picture_url as "posterAvatar",
                u.email as "posterEmail",
                (
                    SELECT COUNT(*)
                    FROM ${this.commentVotesRepository.metadata.tableName} cv
                    WHERE cv.comment_id = c.id::text
                    AND cv.vote_type = '${VoteType.UPVOTE}'
                ) as "numberOfUpVotes",
                (
                    SELECT COUNT(*)
                    FROM ${this.commentVotesRepository.metadata.tableName} cv
                    WHERE cv.comment_id = c.id::text
                    AND cv.vote_type = '${VoteType.DOWNVOTE}'
                ) as "numberOfDownVotes"
            FROM ${this.commentsRepository.metadata.tableName} c
            LEFT JOIN ${this.usersRepository.metadata.tableName} u ON u.id::text = c.commenter_id
            WHERE c.post_id = '${cleanSqlString(postId)}'
            AND c.parent_id IS NULL
            ORDER BY c.created_at ASC
        ),
        comment_tree AS (
          SELECT 
            c.*,
            1 as depth,
            ARRAY[c.id] as path
          FROM ordered_roots c

          UNION ALL

          SELECT
            c.id as id,
            c.created_at as "createdAt",
            c.message as message,
            c.parent_id as "parentId",
            c.deleted_at as "deletedAt",
            u.username as "posterUsername",
            u.profile_picture_url as "posterAvatar",
            u.email as "posterEmail",
            (
              SELECT COUNT(*)
              FROM ${this.commentVotesRepository.metadata.tableName} cv
              WHERE cv.comment_id = c.id::text
              AND cv.vote_type = '${VoteType.UPVOTE}'
            ) as "numberOfUpVotes",
            (
              SELECT COUNT(*)
              FROM ${this.commentVotesRepository.metadata.tableName} cv
              WHERE cv.comment_id = c.id::text
              AND cv.vote_type = '${VoteType.DOWNVOTE}'
            ) as "numberOfDownVotes",
            ct.depth + 1,
            path || c.id
          FROM ${this.commentsRepository.metadata.tableName} c
          LEFT JOIN ${this.usersRepository.metadata.tableName} u ON u.id::text = c.commenter_id
          INNER JOIN comment_tree ct ON c.parent_id = ct.id::text
        )
        SELECT * FROM comment_tree ORDER BY path;
    `);

    return comments.map((c) => ({
      id: c.id,
      createdAt: c.createdAt,
      message: c.message,
      posterUsername: c.posterUsername,
      posterAvatar: c.posterAvatar,
      parentId: c.parentId,
      numberOfUpVotes: parseInt(c.numberOfUpVotes),
      numberOfDownVotes: parseInt(c.numberOfDownVotes),
      posterEmail: c.posterEmail,
      deleted: c.deletedAt !== null,
    }));
  }

  private buildCommentTree(comments: AdminCommentDto[]): AdminCommentDto[] {
    const idToNode = new Map<string, AdminCommentDto>();
    const tree: AdminCommentDto[] = [];

    // Initialize nodes with empty children arrays
    for (const comment of comments) {
      idToNode.set(comment.id, { ...comment, comments: [] });
    }

    for (const comment of comments) {
      const node = idToNode.get(comment.id)!;
      if (comment.parentId) {
        const parent = idToNode.get(comment.parentId);
        if (parent) {
          parent.comments.push(node);
        } else {
          // Orphaned comment (parent missing)
          tree.push(node);
        }
      } else {
        // Top-level comment
        tree.push(node);
      }
    }

    return tree;
  }
}

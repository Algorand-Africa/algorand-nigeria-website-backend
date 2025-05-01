import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import {
  Comment,
  CommentVote,
  ForumCategory,
  Post,
  PostImage,
  PostVote,
  SavedPost,
  User,
} from 'src/dal/entities';
import { EntityManager, Repository } from 'typeorm';
import { CategoryDto } from '../dto/category.dto';
import { FileUploadService, PaginatedResponse } from 'src/modules/core';
import { PaginationParams } from 'src/modules/core/dto/pagination-params.dto';
import {
  CreatePostDto,
  FetchPostsQueryDto,
  PostDto,
  PostPreviewDto,
} from '../dto/post.dto';
import { VoteType } from '../enum/vote-type.enum';
import { isUUID } from 'class-validator';
import { CommentDto, CreateCommentDto } from '../dto/comment.dto';
import { cleanSqlString } from 'src/utils/clean-string';
import { PostStatus } from '../enum/post-status.enum';
import { ImageData } from 'src/modules/core/services/file-upload/interface';
import { SocketGateway } from 'src/modules/core/providers/socket.provider';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(ForumCategory)
    private readonly categoriesRepository: Repository<ForumCategory>,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(PostImage)
    private readonly postImagesRepository: Repository<PostImage>,

    @InjectRepository(PostVote)
    private readonly postVotesRepository: Repository<PostVote>,

    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,

    @InjectRepository(CommentVote)
    private readonly commentVotesRepository: Repository<CommentVote>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(SavedPost)
    private readonly savedPostsRepository: Repository<SavedPost>,

    @InjectEntityManager()
    private readonly manager: EntityManager,

    private readonly fileUploadService: FileUploadService,

    private readonly socketGateway: SocketGateway,
  ) {}

  async fetchAllCategories(
    options: PaginationParams,
  ): Promise<PaginatedResponse<CategoryDto>> {
    const { page, pageSize, skip, search } = options;

    const qb = this.categoriesRepository
      .createQueryBuilder('c')
      .select(['c.*'])
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select('COUNT(*)')
            .from(Post, 'p')
            .where('p.category_id = c.id::text'),
        'totalPosts',
      );

    if (search) {
      qb.andWhere('c.name ILIKE :search', { search: `%${search}%` });
    }

    qb.offset(skip)
      .limit(pageSize)
      .orderBy('c.created_at', 'DESC')
      .groupBy('c.id');

    const [categories, total] = await Promise.all([
      qb.getRawMany(),
      qb.getCount(),
    ]);

    return new PaginatedResponse(
      categories.map((category) => ({
        id: category.slug,
        name: category.name,
        description: category.description,
        color: category.color,
        textColor: category.text_color,
        image: category.image,
        totalPosts: parseInt(category.totalPosts),
        createdAt: category.created_at,
      })),
      total,
      page,
      pageSize,
    );
  }

  async fetchSingleCategory(categoryId: string): Promise<CategoryDto> {
    const qb = this.categoriesRepository
      .createQueryBuilder('c')
      .select(['c.*'])
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select('COUNT(*)')
            .from(Post, 'p')
            .where('p.category_id = c.id::text'),
        'totalPosts',
      )
      .where('c.slug = :categoryId OR c.id::text = :categoryId', {
        categoryId,
      })
      .orderBy('c.created_at', 'DESC')
      .groupBy('c.id');

    const category = await qb.getRawOne();

    return {
      id: category.slug,
      name: category.name,
      description: category.description,
      color: category.color,
      textColor: category.text_color,
      image: category.image,
      totalPosts: parseInt(category.totalPosts),
      createdAt: category.created_at,
    };
  }

  async fetchPostPreviews(
    options: FetchPostsQueryDto,
    userId?: string,
  ): Promise<PaginatedResponse<PostPreviewDto>> {
    const {
      page,
      pageSize,
      skip,
      search,
      categoryId,
      sortBy = 'createdAt',
    } = options;

    const sortByMap = {
      createdAt: 'p.created_at',
      numberOfComments: '"numberOfComments"',
    };

    const qb = this.postsRepository
      .createQueryBuilder('p')
      .select([
        'p.*',
        'c.name as category',
        'c.color as "categoryColor"',
        'c.text_color as "categoryTextColor"',
        'u.username as "posterUsername"',
        'u.profile_picture_url as "posterAvatar"',
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
            .select('pm.image_url')
            .from(PostImage, 'pm')
            .where('pm.post_id = p.id::text')
            .orderBy('pm.created_at', 'ASC')
            .limit(1),
        'image',
      )
      .where('p.status != :status', { status: PostStatus.FLAGGED });

    if (userId) {
      qb.addSelect(
        (qb) =>
          qb
            .subQuery()
            .select('1')
            .from(PostVote, 'pv')
            .where('pv.post_id = p.id::text AND pv.voter_id = :userId', {
              userId,
            })
            .andWhere('pv.vote_type = :voteType', {
              voteType: VoteType.UPVOTE,
            })
            .limit(1),
        'upVoted',
      )
        .addSelect(
          (qb) =>
            qb
              .subQuery()
              .select('1')
              .from(PostVote, 'pv')
              .where('pv.post_id = p.id::text AND pv.voter_id = :userId', {
                userId,
              })
              .andWhere('pv.vote_type = :voteType', {
                voteType: VoteType.DOWNVOTE,
              }),
          'downVoted',
        )
        .addSelect(
          (qb) =>
            qb
              .subQuery()
              .select('COUNT(*)')
              .from(SavedPost, 'sp')
              .where(`sp.post_id = p.id::text AND sp.user_id = '${userId}'`),
          'saved',
        );
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
      .orderBy(
        sortByMap[sortBy],
        sortBy === 'numberOfComments' ? 'DESC' : 'ASC',
      );

    const [posts, total] = await Promise.all([qb.getRawMany(), qb.getCount()]);

    return new PaginatedResponse(
      posts.map((post) => ({
        id: post.id,
        title: post.title,
        category: post.category,
        categoryColor: post.categoryColor,
        categoryTextColor: post.categoryTextColor,
        createdAt: post.created_at,
        numberOfComments: parseInt(post.numberOfComments),
        numberOfUpVotes: parseInt(post.numberOfUpVotes),
        posterUsername: post.posterUsername,
        posterAvatar: post.posterAvatar,
        status: post.status,
        image: post.image,
        upVoted: Boolean(Number(post.upVoted) > 0),
        downVoted: Boolean(Number(post.downVoted) > 0),
        saved: Boolean(Number(post.saved) > 0),
      })),
      total,
      page,
      pageSize,
    );
  }

  async fetchPost(id: string, userId?: string): Promise<PostDto> {
    const qb = this.postsRepository
      .createQueryBuilder('p')
      .select([
        'p.*',
        'c.name as category',
        'c.color as "categoryColor"',
        'c.text_color as "categoryTextColor"',
        'u.username as "posterUsername"',
        'u.profile_picture_url as "posterAvatar"',
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
            .where('pv.post_id = p.id::text'),
        'numberOfUpVotes',
      )
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select('array_agg(pm.image_url ORDER BY pm.created_at ASC)')
            .from(PostImage, 'pm')
            .where('pm.post_id = p.id::text'),
        'images',
      );

    if (userId) {
      qb.addSelect(
        (qb) =>
          qb
            .subQuery()
            .select('COUNT(*)')
            .from(PostVote, 'pv')
            .where(`pv.post_id = p.id::text AND pv.voter_id = '${userId}'`)
            .andWhere(`pv.vote_type = '${VoteType.UPVOTE}'`),
        'upVoted',
      )
        .addSelect(
          (qb) =>
            qb
              .subQuery()
              .select('COUNT(*)')
              .from(PostVote, 'pv')
              .where(`pv.post_id = p.id::text AND pv.voter_id = '${userId}'`)
              .andWhere(`pv.vote_type = '${VoteType.DOWNVOTE}'`),
          'downVoted',
        )
        .addSelect(
          (qb) =>
            qb
              .subQuery()
              .select('COUNT(*)')
              .from(SavedPost, 'sp')
              .where(`sp.post_id = p.id::text AND sp.user_id = '${userId}'`),
          'saved',
        );
    }

    const post = await qb.where('p.id = :id', { id }).getRawOne();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return {
      id: post.id,
      title: post.title,
      message: post.message,
      category: post.category,
      categoryColor: post.categoryColor,
      categoryTextColor: post.categoryTextColor,
      createdAt: post.created_at,
      numberOfComments: parseInt(post.numberOfComments),
      numberOfUpVotes: parseInt(post.numberOfUpVotes),
      posterUsername: post.posterUsername,
      posterAvatar: post.posterAvatar,
      status: post.status,
      images: post.images || [],
      upVoted: Boolean(Number(post.upVoted) > 0),
      downVoted: Boolean(Number(post.downVoted) > 0),
      saved: Boolean(Number(post.saved) > 0),
      image: post?.images?.[0],
    };
  }

  async fetchComment(commentId: string, userId?: string): Promise<CommentDto> {
    const qb = this.commentsRepository
      .createQueryBuilder('c')
      .select([
        'c.id as id',
        'c.created_at as "createdAt"',
        'c.message as message',
        'u.username as "posterUsername"',
        'u.profile_picture_url as "posterAvatar"',
      ])
      .leftJoin(User, 'u', 'u.id::text = c.commenter_id')
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .select('COUNT(*)')
            .from(CommentVote, 'cv')
            .where('cv.comment_id = c.id::text'),
        'numberOfUpVotes',
      )
      .where('c.id = :commentId', { commentId });

    const comment = await qb.getRawOne();

    let upVoted = false;
    let downVoted = false;

    if (userId) {
      const userVote = await this.commentVotesRepository.findOne({
        where: { comment_id: comment.id, voter_id: userId },
      });

      if (userVote) {
        upVoted = userVote.vote_type === VoteType.UPVOTE;
        downVoted = userVote.vote_type === VoteType.DOWNVOTE;
      }
    }

    return {
      id: comment.id,
      createdAt: comment.created_at,
      message: comment.message,
      posterUsername: comment.posterUsername,
      posterAvatar: comment.posterAvatar,
      numberOfUpVotes: parseInt(comment.numberOfUpVotes),
      upVoted,
      downVoted,
    };
  }

  async fetchCommentsUnderPost(
    postId: string,
    userId?: string,
  ): Promise<CommentDto[]> {
    const comments = await this.getRawComments(postId, userId);
    return this.buildCommentTree(comments);
  }

  async createPost(dto: CreatePostDto, userId: string): Promise<PostDto> {
    const { title, message, categoryId, images } = dto;

    const where = isUUID(categoryId)
      ? { id: categoryId }
      : { slug: categoryId };

    const category = await this.categoriesRepository.findOne({
      where,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const uploadedImages: ImageData[] = [];

    if (images.length > 0) {
      const uploadedData = await Promise.all(
        images.map((image) =>
          this.fileUploadService.uploadToCloudinary(image, null, 'posts'),
        ),
      );
      uploadedImages.push(...uploadedData);
    }

    const post = await this.postsRepository.save({
      title,
      message,
      category_id: category.id,
      poster_id: userId,
    });

    await this.postImagesRepository.save(
      uploadedImages.map((image) => ({
        post_id: post.id,
        image_url: image.image,
      })),
    );

    return this.fetchPost(post.id, userId);
  }

  async postComment(
    dto: CreateCommentDto,
    userId: string,
  ): Promise<CommentDto> {
    const { message, postId, parentCommentId } = dto;

    const comment = parentCommentId
      ? await this.createReplyComment(message, parentCommentId, userId)
      : await this.createTopLevelComment(message, postId, userId);

    this.socketGateway.emitEvent('comment-created', {
      comment,
      postId,
    });

    return this.fetchComment(comment.id, userId);
  }

  async upvotePost(
    postId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingVote = await this.postVotesRepository.findOne({
      where: { post_id: postId, voter_id: userId },
    });

    if (existingVote) {
      if (existingVote.vote_type === VoteType.UPVOTE) {
        await this.postVotesRepository.delete(existingVote.id);
        return { message: 'Post unupvoted successfully' };
      }

      await this.postVotesRepository.update(existingVote.id, {
        vote_type: VoteType.UPVOTE,
      });
      return { message: 'Post upvoted successfully' };
    }

    await this.postVotesRepository.save({
      post_id: postId,
      voter_id: userId,
      vote_type: VoteType.UPVOTE,
    });
    return { message: 'Post upvoted successfully' };
  }

  async downvotePost(
    postId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingVote = await this.postVotesRepository.findOne({
      where: { post_id: postId, voter_id: userId },
    });

    if (existingVote) {
      if (existingVote.vote_type === VoteType.DOWNVOTE) {
        await this.postVotesRepository.delete(existingVote.id);
        return { message: 'Post undownvoted successfully' };
      }

      await this.postVotesRepository.update(existingVote.id, {
        vote_type: VoteType.DOWNVOTE,
      });
      return { message: 'Post downvoted successfully' };
    }

    await this.postVotesRepository.save({
      post_id: postId,
      voter_id: userId,
      vote_type: VoteType.DOWNVOTE,
    });
    return { message: 'Post downvoted successfully' };
  }

  async upvoteComment(
    commentId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existingVote = await this.commentVotesRepository.findOne({
      where: { comment_id: commentId, voter_id: userId },
    });

    if (existingVote) {
      if (existingVote.vote_type === VoteType.UPVOTE) {
        await this.commentVotesRepository.delete(existingVote.id);
        return { message: 'Comment unupvoted successfully' };
      }

      await this.commentVotesRepository.update(existingVote.id, {
        vote_type: VoteType.UPVOTE,
      });
      return { message: 'Comment upvoted successfully' };
    }

    await this.commentVotesRepository.save({
      comment_id: commentId,
      voter_id: userId,
      vote_type: VoteType.UPVOTE,
    });
    return { message: 'Comment upvoted successfully' };
  }

  async downvoteComment(
    commentId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existingVote = await this.commentVotesRepository.findOne({
      where: { comment_id: commentId, voter_id: userId },
    });

    if (existingVote) {
      if (existingVote.vote_type === VoteType.DOWNVOTE) {
        await this.commentVotesRepository.delete(existingVote.id);
        return { message: 'Comment undownvoted successfully' };
      }

      await this.commentVotesRepository.update(existingVote.id, {
        vote_type: VoteType.DOWNVOTE,
      });
      return { message: 'Comment downvoted successfully' };
    }

    await this.commentVotesRepository.save({
      comment_id: commentId,
      voter_id: userId,
      vote_type: VoteType.DOWNVOTE,
    });
    return { message: 'Comment downvoted successfully' };
  }

  async savePost(postId: string, userId: string): Promise<{ message: string }> {
    const existingSavedPost = await this.savedPostsRepository.findOne({
      where: { post_id: postId, user_id: userId },
    });

    if (existingSavedPost) {
      await this.savedPostsRepository.delete(existingSavedPost.id);
      return { message: 'Post unsaved successfully' };
    } else {
      await this.savedPostsRepository.save({
        post_id: postId,
        user_id: userId,
      });
      return { message: 'Post saved successfully' };
    }
  }

  private async createReplyComment(
    message: string,
    parentCommentId: string,
    userId: string,
  ): Promise<Comment> {
    const parentComment = await this.commentsRepository.findOne({
      where: { id: parentCommentId },
    });

    if (!parentComment) {
      throw new NotFoundException('Parent comment not found');
    }

    return this.commentsRepository.save({
      message,
      post_id: parentComment.post_id,
      commenter_id: userId,
      parent_id: parentCommentId,
    });
  }

  private async createTopLevelComment(
    message: string,
    postId: string,
    userId: string,
  ): Promise<Comment> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.commentsRepository.save({
      message,
      post_id: postId,
      commenter_id: userId,
      parent_id: null,
    });
  }

  private async getRawComments(
    postId: string,
    userId?: string,
  ): Promise<CommentDto[]> {
    const comments = await this.manager.query(`
        WITH RECURSIVE ordered_roots AS (
            SELECT
                c.id as id,
                c.created_at as "createdAt",
                c.message as message,
                c.parent_id as "parentId",
                u.username as "posterUsername",
                u.profile_picture_url as "posterAvatar",
                (
                    SELECT COUNT(*)
                    FROM ${this.commentVotesRepository.metadata.tableName} cv
                    WHERE cv.comment_id = c.id::text
                    AND cv.vote_type = '${VoteType.UPVOTE}'
                ) as "numberOfUpVotes"
                ${
                  userId
                    ? `,
                    (
                        SELECT COUNT(*)
                        FROM ${this.commentVotesRepository.metadata.tableName} cv
                        WHERE cv.comment_id = c.id::text AND cv.vote_type = '${VoteType.DOWNVOTE}' AND cv.voter_id = '${cleanSqlString(userId)}'
                    ) as "downVoted",
                    (
                        SELECT COUNT(*)
                        FROM ${this.commentVotesRepository.metadata.tableName} cv
                        WHERE cv.comment_id = c.id::text AND cv.vote_type = '${VoteType.UPVOTE}' AND cv.voter_id = '${cleanSqlString(userId)}'
                    ) as "upVoted"
                `
                    : ''
                }
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
            u.username as "posterUsername",
            u.profile_picture_url as "posterAvatar",
            (
              SELECT COUNT(*)
              FROM ${this.commentVotesRepository.metadata.tableName} cv
              WHERE cv.comment_id = c.id::text
              AND cv.vote_type = '${VoteType.UPVOTE}'
            ) as "numberOfUpVotes"
            ${
              userId
                ? `,
                (
                    SELECT COUNT(*)
                    FROM ${this.commentVotesRepository.metadata.tableName} cv
                    WHERE cv.comment_id = c.id::text AND cv.vote_type = '${VoteType.DOWNVOTE}' AND cv.voter_id = '${cleanSqlString(userId)}'
                ) as "downVoted",
                (
                    SELECT COUNT(*)
                    FROM ${this.commentVotesRepository.metadata.tableName} cv
                    WHERE cv.comment_id = c.id::text AND cv.vote_type = '${VoteType.UPVOTE}' AND cv.voter_id = '${cleanSqlString(userId)}'
                ) as "upVoted"
            `
                : ''
            },
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
      upVoted: Boolean(Number(c.upVoted) > 0),
      downVoted: Boolean(Number(c.downVoted) > 0),
    }));
  }

  private buildCommentTree(comments: CommentDto[]): CommentDto[] {
    const idToNode = new Map<string, CommentDto>();
    const tree: CommentDto[] = [];

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

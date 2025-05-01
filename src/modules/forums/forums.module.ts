import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCategoriesController } from './controllers/admin-categories.controller';
import { AdminCategoriesService } from './services/admin-categories.service';
import { ForumCategory } from 'src/dal/entities/forum-category.entity';
import { Comment } from 'src/dal/entities/comment.entity';
import { Post } from 'src/dal/entities/post.entity';
import { PostImage } from 'src/dal/entities/post-image.entity';
import { PostVote } from 'src/dal/entities/post-vote.entity';
import { CommentVote } from 'src/dal/entities/comment-vote.entity';
import { User } from 'src/dal/entities/user.entity';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';
import { SavedPost } from 'src/dal/entities';
import { SocketGateway } from '../core/providers/socket.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ForumCategory,
      Comment,
      Post,
      PostImage,
      PostVote,
      CommentVote,
      User,
      SavedPost,
    ]),
  ],
  controllers: [AdminCategoriesController, PostsController],
  providers: [AdminCategoriesService, PostsService, SocketGateway],
  exports: [AdminCategoriesService, PostsService],
})
export class ForumsModule {}

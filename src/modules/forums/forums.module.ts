import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCategoriesController } from './controllers/admin-categories.controller';
import { CategoriesService } from './services/categories.service';
import { ForumCategory } from 'src/dal/entities/forum-category.entity';
import { Comment } from 'src/dal/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForumCategory, Comment])],
  controllers: [AdminCategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class ForumsModule {}

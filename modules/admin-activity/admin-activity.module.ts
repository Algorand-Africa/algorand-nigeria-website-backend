import { Module } from '@nestjs/common';
import { AdminActivityService } from './admin-activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin, AdminActivity } from '../../libs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AdminActivity, Admin])],
  providers: [AdminActivityService],
  exports: [AdminActivityService],
})
export class AdminActivityModule {}

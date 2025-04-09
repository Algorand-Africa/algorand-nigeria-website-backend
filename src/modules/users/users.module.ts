import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../dal/entities/user.entity';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminUsersService } from './services/admin-users.service';
import { CustomerEnquiry } from 'src/dal/entities';
import { CustomerEnquiryController } from './controllers/customer-enquiry.controller';
import { CustomerEnquiryService } from './services/customer-enquiry.service';
@Module({
  imports: [TypeOrmModule.forFeature([User, CustomerEnquiry])],
  controllers: [AdminUsersController, CustomerEnquiryController],
  providers: [AdminUsersService, CustomerEnquiryService],
  exports: [AdminUsersService, CustomerEnquiryService],
})
export class UsersModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../dal/entities';
import { PaginatedResponse } from '../../core/dto/paginated-response.dto';
import {
  GetAllUsersQueryDto,
  UpdateUserDto,
  UserDto,
  UserDtoMapper,
} from '../dto/user.dto';
@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(
    query: GetAllUsersQueryDto,
  ): Promise<PaginatedResponse<UserDto>> {
    const { page, pageSize, search, skip, role, status } = query;

    const qb = this.userRepo.createQueryBuilder('u').where('true');

    if (role) {
      qb.andWhere('u.role = :role', { role });
    }

    if (status) {
      qb.andWhere('u.status = :status', { status });
    }

    if (search) {
      qb.andWhere('u.full_name ILIKE :search OR u.email ILIKE :search', {
        search: `%${search}%`,
      });
    }

    qb.skip(skip).take(pageSize);

    const [data, total] = await qb.getManyAndCount();

    return new PaginatedResponse(
      data.map(UserDtoMapper),
      total,
      page,
      pageSize,
    );
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return UserDtoMapper(user);
  }

  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return UserDtoMapper(user);
  }

  async update(id: string, data: UpdateUserDto): Promise<UserDto> {
    const user = await this.findOne(id);

    await this.userRepo.update(id, data);

    return this.findOne(id);
  }
}

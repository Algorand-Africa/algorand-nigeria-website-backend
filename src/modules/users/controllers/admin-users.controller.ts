import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { PaginatedResponse } from '../../core/dto/paginated-response.dto';
import { RoleType } from '../enums/role-type.enum';
import { AdminUsersService } from '../services/admin-users.service';
import { GetAllUsersQueryDto, UpdateUserDto, UserDto } from '../dto/user.dto';
@ApiTags('User Management')
@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly userService: AdminUsersService) {}

  @Get()
  @Roles(RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'All users fetched successfully',
    type: UserDto,
  })
  async findAll(
    @Query() query: GetAllUsersQueryDto,
  ): Promise<PaginatedResponse<UserDto>> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @Roles(RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User fetched successfully',
    type: UserDto,
  })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get(':email/email')
  @Roles(RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({
    status: 200,
    description: 'User fetched successfully',
    type: UserDto,
  })
  async findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Put(':id')
  @Roles(RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserDto,
  })
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }
}

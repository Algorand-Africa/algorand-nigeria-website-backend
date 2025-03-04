import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageOptionsDto, RequestDto, RoleDto, UpdateRoleDto } from 'libs/dto';
import { AdminJwtAuthGuard } from 'libs/guards/jwt/admin-jwt-auth.guard';
import { RbacGuard } from 'libs/guards/jwt/rbac.guard';
import { Role } from 'libs/typeorm';
import { RoleService } from 'modules/role/role.service';
import { Permissions } from 'libs/decorators/permissions.decorator';
import { PERMISSION } from 'libs/enums';
import { AdminActivityService } from 'modules/admin-activity/admin-activity.service';

@ApiBearerAuth('Bearer')
@UseGuards(AdminJwtAuthGuard)
@ApiTags('Role Manager')
@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private adminActivityService: AdminActivityService,
  ) {}

  @ApiOperation({ summary: 'This returns all available roles' })
  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Object containing role details.',
    type: Role,
    isArray: true,
  })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.VIEW_ROLES)
  getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @ApiOperation({
    summary: 'This returns all available roles with associated admin',
  })
  @Get('all-admin')
  @ApiResponse({
    status: 200,
    description: 'Object containing role details.',
    type: Role,
    isArray: true,
  })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.VIEW_ROLES)
  getAllRolesWithAdmin(@Query() pageOptions: PageOptionsDto) {
    return this.roleService.getAllRolesWithAdmin(pageOptions);
  }

  @ApiOperation({ summary: "This returns a particular role by it's id" })
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Object containing Role detail.',
    type: Role,
  })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.VIEW_ROLES)
  getRoleById(@Param('id') id: string) {
    return this.roleService.getRoleById(id);
  }

  @ApiOperation({ summary: 'This creates a new role.' })
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Object containing new role detail.',
    type: Role,
  })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.CREATE_ROLE)
  createRole(
    @Body(ValidationPipe) roledto: RoleDto,
    @Request() req: RequestDto,
  ) {
    const description = `Created a new admin role.`;

    return this.adminActivityService.logActivity({
      description,
      request: req,
      callback: async () => {
        return this.roleService.createRole(roledto);
      },
    });
  }

  @ApiOperation({ summary: 'This updates a pre-existing role' })
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Object containing updated role detail.',
    type: Role,
  })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.EDIT_ROLE)
  updateRole(
    @Param('id') id: string,
    @Body(ValidationPipe) updateRoleDto: UpdateRoleDto,
    @Request() req: RequestDto,
  ) {
    const description = `Updated admin role with id ${id}.`;

    return this.adminActivityService.logActivity({
      description,
      request: req,
      callback: async () => {
        return this.roleService.updateRole(id, updateRoleDto);
      },
    });
  }

  @ApiOperation({ summary: 'This delete a role.' })
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Object containing deleted role detail.',
    type: Role,
  })
  @UseGuards(AdminJwtAuthGuard, RbacGuard)
  @Permissions(PERMISSION.DELETE_ROLE)
  deleteRole(@Param('id') id: string, @Request() req: RequestDto) {
    const description = `Deleted admin role with id ${id}.`;

    return this.adminActivityService.logActivity({
      description,
      request: req,
      callback: async () => {
        return this.roleService.deleteRole(id);
      },
    });
  }
}

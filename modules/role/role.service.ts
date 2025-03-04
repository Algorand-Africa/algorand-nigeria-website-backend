import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'libs/typeorm/role.entity';
import { RoleDto, UpdateRoleDto } from 'libs/dto/role.dto';
import { createPageOptionFallBack } from 'libs/utils';
import { PageDto, PageMetaDto, PageOptionsDto } from 'libs/dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(
    roleDto: RoleDto,
  ): Promise<{ status: number; description: string; role: Role }> {
    const newRole = this.roleRepository.create(roleDto);
    const role = await this.roleRepository.save(newRole);

    return {
      status: 200,
      description: "Congrats, you've successfully created a role.",
      role: role,
    };
  }

  async getAllRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async getAllRolesWithAdmin(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    const pageOptionsDtoFallBack = createPageOptionFallBack(pageOptionsDto);

    queryBuilder
      .leftJoinAndSelect('role.admins', 'admins')
      .orderBy('role.createdAt', pageOptionsDtoFallBack.order as 'ASC' | 'DESC')
      .skip(pageOptionsDtoFallBack.skip)
      .take(pageOptionsDtoFallBack.numOfItemsPerPage);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: pageOptionsDtoFallBack,
    });

    const rolesWithMappedAdmins = entities.map((role) => {
      return {
        ...role,
        admins: role.admins.map((admin) => ({
          id: admin.id,
          email: admin.email,
          profile: admin.profile,
        })),
      };
    });

    return new PageDto(rolesWithMappedAdmins, pageMetaDto);
  }

  async getRoleById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException('Role does not exist');
    return role;
  }

  async updateRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<{ status: number; description: string; role: Role }> {
    const role = await this.getRoleById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    Object.assign(role, updateRoleDto);

    const updateRole = await this.roleRepository.save(role);

    return {
      status: 200,
      description: 'Role update was successful.',
      role: updateRole,
    };
  }

  async deleteRole(id: string) {
    const role = await this.getRoleById(id);
    if (!role) {
      throw new NotFoundException('Role does not exist');
    }

    const deletedRole = await this.roleRepository.remove(role);
    return {
      status: 200,
      description: 'Role has been deleted successfully.',
      role: deletedRole,
    };
  }
}

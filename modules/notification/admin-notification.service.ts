import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateAdminNotificationDto,
  EmitMassNotificationDto,
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from 'libs/dto';
import { AdminNotifications, Admin } from 'libs/typeorm';
import { createPageOptionFallBack } from 'libs/utils';
import { Repository } from 'typeorm';
import { AdminGateway } from './admin.gateway';
import { PERMISSION } from 'libs/enums';

@Injectable()
export class AdminNotificationService {
  private readonly logger = new Logger(AdminNotificationService.name);

  constructor(
    @InjectRepository(AdminNotifications)
    private readonly notificationRepo: Repository<AdminNotifications>,
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    private readonly socketGateway: AdminGateway,
  ) {}

  async createNotification(data: CreateAdminNotificationDto) {
    try {
      const notification = await this.notificationRepo.save(
        this.notificationRepo.create(data),
      );

      this.socketGateway.emitNotificationEvent({
        eventName: data.adminId,
        data: notification,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `There was an error creating admin notification.`,
      );
    }
  }

  async getUnreadCount(adminId: string): Promise<number> {
    const count = await this.notificationRepo.count({
      where: {
        adminId,
        read: false,
      },
    });

    return count;
  }

  async getAll(query: PageOptionsDto, adminId: string) {
    const pageOptionsDto = createPageOptionFallBack(query);
    const { order, skip, numOfItemsPerPage } = pageOptionsDto;
    const queryBuilder = this.notificationRepo
      .createQueryBuilder('n')
      .where('n.adminId = :id', { id: adminId })
      .orderBy('n.createdAt', order)
      .skip(skip)
      .take(numOfItemsPerPage);

    const [data, itemCount] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto,
    });

    return new PageDto(data, pageMetaDto);
  }

  async markAllAsRead(adminId: string) {
    try {
      await this.notificationRepo.update(
        { read: false, adminId },
        { read: true },
      );

      return this.getUnreadCount(adminId);
    } catch (error) {
      this.logger.error(error);
      throw new ConflictException(`There was an error marking all as read.`);
    }
  }

  async markAsRead(id: string, adminId: string) {
    try {
      await this.notificationRepo.update({ id, adminId }, { read: true });
      return await this.notificationRepo.findOneBy({ id });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        `There was an error marking notification with id: ${id} as read.`,
      );
    }
  }

  async getAllAdminsByPermission(permission: PERMISSION) {
    const adminQuery = this.adminRepo
      .createQueryBuilder('admin')
      .select(['admin.id', 'admin.email'])
      .leftJoinAndSelect('admin.role', 'role')
      .where('role.permissions @> :permission', {
        permission: JSON.stringify([permission]),
      });

    const admins = await adminQuery.getMany();
    const adminIds = admins.map((admin) => admin.id);

    return adminIds;
  }

  async massEmitNotification(dto: EmitMassNotificationDto) {
    const adminIds = await this.getAllAdminsByPermission(dto.permission);

    await Promise.all(
      adminIds.map(async (adminId) => {
        try {
          await this.createNotification({
            adminId,
            title: dto.title,
            message: dto.message,
            event: dto.event,
            metadata: dto.metadata,
          });
        } catch (error) {
          console.error(
            `Failed to send notification to admin ${adminId}:`,
            error,
          );
        }
      }),
    );
  }
}

import { format } from 'date-fns';
import { AdminActivityDto } from 'libs/dto';

export const toAdminActivityResponseDto = (
  adminActivity: any,
): AdminActivityDto => {
  return {
    id: adminActivity.activity_id,
    createdAt: adminActivity.activity_createdAt,
    adminId: adminActivity.activity_adminId,
    description: adminActivity.activity_description,
    statusCode: adminActivity.activity_statusCode,
    url: adminActivity.activity_url,
    method: adminActivity.activity_method,
    headers: adminActivity.activity_headers,
    payload: adminActivity.activity_payload,
    adminName: adminActivity.adminProfile?.name,
    adminEmail: adminActivity.adminEmail,
    adminImage: adminActivity.adminProfile?.image,
  };
};

export const getStatusMappedValues = (
  statusCode: number,
): string | undefined => {
  const statusMap: { [key: number]: string } = {
    200: 'Success',
    500: 'Failed',
  };

  return statusMap[statusCode];
};

export const formatDate = (date: Date): string => {
  return format(date, 'hh:mma do MMMM yyyy');
};

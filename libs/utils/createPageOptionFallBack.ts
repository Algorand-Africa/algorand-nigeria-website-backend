import { PageOptionsDto } from 'libs/dto';
import { Order } from 'libs/enums';

/**
 * @description This function accepts a pagination query object and
 * makes sure no fields are empty. It adds default values to omitted fields.
 * @param pageOptionsDto The pagination query object.
 * @param defaults The default values to be used as fallback.
 * @returns {PageOptionsDto} A transformed pagination query object with no ommitted fields.
 */
export const createPageOptionFallBack = (
  pageOptionsDto: PageOptionsDto,
  defaults?: {
    order?: Order;
    page?: number;
    numOfItemsPerPage?: number;
    orderBy?: string;
  },
) => {
  const order = pageOptionsDto.order || defaults?.order || Order.DESC;
  const page = pageOptionsDto.page || defaults?.page || 1;
  const numOfItemsPerPage =
    pageOptionsDto.numOfItemsPerPage || defaults?.numOfItemsPerPage || 10;
  const skip = (page - 1) * numOfItemsPerPage;
  const orderBy = pageOptionsDto.orderBy || defaults?.orderBy || 'createdAt';

  const pageOptionsDtoFallBack: PageOptionsDto = {
    order,
    page,
    numOfItemsPerPage,
    skip,
    orderBy,
  };

  return pageOptionsDtoFallBack;
};

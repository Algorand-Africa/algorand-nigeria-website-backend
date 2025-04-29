import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { slugify } from '../../../utils/slugify';
import { ForumCategory as Category } from 'src/dal/entities/forum-category.entity';
import { FileUploadService } from 'src/modules/core';
import { CategoryDto } from '../dto/category.dto';
import { PaginationParams } from 'src/modules/core/dto/pagination-params.dto';
import { PaginatedResponse } from 'src/modules/core/dto/paginated-response.dto';
import { IMAGE_BASE64_REGEX } from 'src/modules/core/constants/base64-regex';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,

    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const slug = slugify(createCategoryDto.name);

    // Check if slug already exists
    const existingCategory = await this.categoriesRepository.findOne({
      where: { slug },
    });

    if (existingCategory) {
      throw new BadRequestException(
        `Category with slug "${slug}" already exists`,
      );
    }

    const image = await this.fileUploadService.uploadToCloudinary(
      createCategoryDto.base64Image,
      null,
      'categories',
    );

    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      image: image.image,
      slug,
    });

    return this.categoriesRepository.save(category);
  }

  async findAll(
    options: PaginationParams,
  ): Promise<PaginatedResponse<CategoryDto>> {
    const { page, pageSize, skip, search } = options;

    const qb = this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoin('users', 'users', 'users.id = category.creator_id')
      .select([
        'category.id as id',
        'category.name as name',
        'category.description as description',
        'category.color as color',
        'category.image as image',
        'category.slug as slug',
        'users.email as "createdBy"',
      ]);

    if (search) {
      qb.andWhere('category.name ILIKE :search', { search: `%${search}%` });
    }

    qb.offset(skip).limit(pageSize);

    const [categories, total] = await Promise.all([
      qb.getRawMany(),
      qb.getCount(),
    ]);

    return new PaginatedResponse(
      categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
        image: category.image,
        slug: category.slug,
        createdBy: category.createdBy,
      })),
      total,
      page,
      pageSize,
    );
  }

  async findOne(id: string): Promise<CategoryDto> {
    const category = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoin('users', 'users', 'users.id = category.creator_id')
      .select([
        'category.id as id',
        'category.name as name',
        'category.description as description',
        'category.color as color',
        'category.image as image',
        'users.email as "createdBy"',
        'category.slug as slug',
      ])
      .where('category.id = :id', { id })
      .getRawOne();

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
      image: category.image,
      slug: category.slug,
      createdBy: category.createdBy,
    };
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    let slug = category.slug;

    // If name is being updated
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      slug = slugify(updateCategoryDto.name);
    }

    let existingImage = category.image;

    const { image } = updateCategoryDto;

    if (image && IMAGE_BASE64_REGEX.test(image)) {
      const uploadedImage = await this.fileUploadService.uploadToCloudinary(
        image,
        null,
        'categories',
      );
      existingImage = uploadedImage.image;
    }

    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });
    await this.categoriesRepository.remove(category);
  }
}

import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User, Profile } from 'libs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BcryptService } from 'libs/injectables';
import { SendgridService } from 'modules/sendgrid/sendgrid.service';
import { CreateUserDto, UpdateUserProfileDto, UserDto } from 'libs/dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly bcryptService: BcryptService,

    private readonly sendGridService: SendgridService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const { email, username, password, name } = createUserDto;

    if (await this.findUserByEmail(email)) {
      throw new ConflictException(
        'A user with this email address already exists.',
      );
    }

    if (await this.findUserByUsername(username)) {
      throw new ConflictException('A user with this username already exists.');
    }

    const profile = await this.createProfile({ name });

    const newUser = this.userRepository.create({
      ...createUserDto,
      email,
      password: await this.bcryptService.hash(password),
      profile,
    });

    const createdUser = await this.userRepository.save(newUser);

    return {
      id: createdUser.id,
      email: createdUser.email,
      username: createdUser.username,
      profile: {
        id: createdUser.profile.id,
        name: createdUser.profile.name,
        phoneNo: createdUser.profile.phoneNo,
        algoWalletAddress: createdUser.profile.algoWalletAddress,
      },
    };
  }

  async createProfile(dto: UpdateUserProfileDto) {
    const { phoneNo, algoWalletAddress } = dto;
    if (phoneNo && (await this.profileRepository.findOneBy({ phoneNo }))) {
      throw new ConflictException(
        'A user with this phone number already exists.',
      );
    }

    if (
      algoWalletAddress &&
      (await this.profileRepository.findOneBy({ algoWalletAddress }))
    ) {
      throw new ConflictException(
        'A user with this algo wallet address already exists.',
      );
    }

    const profile = this.profileRepository.create(dto);

    return await this.profileRepository.save(profile);
  }

  async findUserByEmail(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }

  async findUserByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async getUserById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      profile: {
        id: user.profile.id,
        name: user.profile.name,
        phoneNo: user.profile.phoneNo,
        algoWalletAddress: user.profile.algoWalletAddress,
      },
    };
  }
}

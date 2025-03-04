import { Injectable, Logger } from '@nestjs/common';
import { User, Profile } from 'libs/typeorm';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BcryptService } from 'libs/injectables';
import { SendgridService } from 'modules/sendgrid/sendgrid.service';

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
}

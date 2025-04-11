import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Multisig } from '../../../dal/entities/multisig.entity';
import { Repository } from 'typeorm';
import {
  MultisigDtoMapper,
  MultisigSessionDtoMapper,
} from '../mappers/multisig.mapper';
import {
  CreateMultisigDto,
  CreateMultisigSessionDto,
  MultisigDto,
  MultisigSessionDto,
  UpdateMultisigSessionDto,
} from '../dto/multisig.dto';
import { MultisigSession } from 'src/dal/entities/multisig-session.entity';

@Injectable()
export class AdminMultisigService {
  constructor(
    @InjectRepository(Multisig)
    private readonly multisigRepository: Repository<Multisig>,

    @InjectRepository(MultisigSession)
    private readonly multisigSessionRepository: Repository<MultisigSession>,
  ) {}

  async getAllMultisigs(): Promise<MultisigDto[]> {
    const multisigs = await this.multisigRepository.find();
    return multisigs.map((multisig) => MultisigDtoMapper(multisig));
  }

  async createMultisig(dto: CreateMultisigDto): Promise<MultisigDto> {
    const multisig = this.multisigRepository.create({
      multisig_address: dto.address,
      multisig_name: dto.name,
      multisig_description: dto.description,
      multisig_members: dto.members,
      multisig_threshold: dto.threshold,
    });
    await this.multisigRepository.save(multisig);
    return MultisigDtoMapper(multisig);
  }

  async getMultisigById(id: string): Promise<MultisigDto> {
    const multisig = await this.multisigRepository.findOne({ where: { id } });

    if (!multisig) {
      throw new NotFoundException('Multisig not found');
    }

    return MultisigDtoMapper(multisig);
  }

  async getMultisigByAddress(address: string): Promise<MultisigDto> {
    const multisig = await this.multisigRepository.findOne({
      where: { multisig_address: address },
    });

    if (!multisig) {
      throw new NotFoundException('Multisig not found');
    }

    return MultisigDtoMapper(multisig);
  }

  async deleteMultisig(id: string): Promise<{ message: string }> {
    const multisig = await this.multisigRepository.findOne({ where: { id } });

    if (!multisig) {
      throw new NotFoundException('Multisig not found');
    }

    await this.multisigRepository.delete(id);

    return { message: 'Multisig deleted successfully' };
  }

  async createMultisigSession(
    dto: CreateMultisigSessionDto,
  ): Promise<MultisigSessionDto> {
    const multisig = await this.multisigRepository.findOne({
      where: { id: dto.id },
    });

    if (!multisig) {
      throw new NotFoundException('Multisig not found');
    }

    const existingSession = await this.multisigSessionRepository.findOne({
      where: { multisig_id: dto.id },
    });

    if (existingSession) {
      await this.multisigSessionRepository.delete(existingSession.id);
    }

    const token = Math.random().toString(36).substring(2, 15);

    const multisigSession = this.multisigSessionRepository.create({
      multisig_id: dto.id,
      session_token: token,
      txns: [],
      members_that_signed: [],
      minimum_signatures: dto.minimumSignatures,
    });

    await this.multisigSessionRepository.save(multisigSession);

    return MultisigSessionDtoMapper(multisig, multisigSession);
  }

  async getMultisigSessionByToken(token: string): Promise<MultisigSessionDto> {
    const multisigSession = await this.multisigSessionRepository.findOne({
      where: { session_token: token },
    });

    if (!multisigSession) {
      throw new NotFoundException('Multisig session not found');
    }

    const multisig = await this.multisigRepository.findOne({
      where: { id: multisigSession.multisig_id },
    });

    return MultisigSessionDtoMapper(multisig, multisigSession);
  }

  async updateMultisigSession(
    dto: UpdateMultisigSessionDto,
  ): Promise<MultisigSessionDto> {
    const multisigSession = await this.multisigSessionRepository.findOne({
      where: { session_token: dto.session },
    });

    if (!multisigSession) {
      throw new NotFoundException('Multisig session not found');
    }

    if (multisigSession.members_that_signed.includes(dto.address)) {
      throw new Error('Already signed');
    }

    if (multisigSession.txns.includes(dto.txn)) {
      throw new Error('Transaction already exists');
    }

    if (
      multisigSession.members_that_signed.length >=
      multisigSession.minimum_signatures
    ) {
      throw new Error('Already reached minimum signatures');
    }

    multisigSession.txns = [...multisigSession.txns, dto.txn];
    multisigSession.members_that_signed = [
      ...multisigSession.members_that_signed,
      dto.address,
    ];

    await this.multisigSessionRepository.save(multisigSession);

    const multisig = await this.multisigRepository.findOne({
      where: { id: multisigSession.multisig_id },
    });

    return MultisigSessionDtoMapper(multisig, multisigSession);
  }

  async deleteMultisigSession(token: string): Promise<{ message: string }> {
    const multisigSession = await this.multisigSessionRepository.findOne({
      where: { session_token: token },
    });

    if (!multisigSession) {
      throw new NotFoundException('Multisig session not found');
    }

    await this.multisigSessionRepository.delete(multisigSession.id);

    return { message: 'Multisig session deleted successfully' };
  }
}

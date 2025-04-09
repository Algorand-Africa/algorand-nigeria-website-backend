import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Multisig } from '../../../dal/entities/multisig.entity';
import { Repository } from 'typeorm';
import { MultisigDtoMapper } from '../mappers/multisig.mapper';
import { CreateMultisigDto, MultisigDto } from '../dto/multisig.dto';

@Injectable()
export class AdminMultisigService {
  constructor(
    @InjectRepository(Multisig)
    private readonly multisigRepository: Repository<Multisig>,
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
}

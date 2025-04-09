import { TypeOrmModule } from '@nestjs/typeorm';
import { Multisig } from 'src/dal/entities/multisig.entity';
import { AdminMultisigService } from './services/admin-multisig.service';
import { AdminMultisigController } from './controllers/admin-multisig.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Multisig])],
  providers: [AdminMultisigService],
  exports: [AdminMultisigService],
  controllers: [AdminMultisigController],
})
export class MultisigModule {}

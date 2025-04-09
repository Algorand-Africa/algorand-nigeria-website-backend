import { Multisig } from 'src/dal/entities/multisig.entity';
import { MultisigDto } from '../dto/multisig.dto';

export const MultisigDtoMapper = (multisig: Multisig): MultisigDto => {
  return {
    id: multisig.id,
    address: multisig.multisig_address,
    name: multisig.multisig_name,
    description: multisig.multisig_description,
    members: multisig.multisig_members,
    threshold: multisig.multisig_threshold,
  };
};

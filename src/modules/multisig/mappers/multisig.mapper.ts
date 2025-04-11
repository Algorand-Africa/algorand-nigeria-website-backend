import { Multisig } from 'src/dal/entities/multisig.entity';
import { MultisigDto, MultisigSessionDto } from '../dto/multisig.dto';
import { MultisigSession } from 'src/dal/entities/multisig-session.entity';

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

export const MultisigSessionDtoMapper = (
  multisig: Multisig,
  multiSigSession: MultisigSession,
): MultisigSessionDto => {
  return {
    id: multisig.id,
    address: multisig.multisig_address,
    name: multisig.multisig_name,
    description: multisig.multisig_description,
    members: multisig.multisig_members,
    threshold: multisig.multisig_threshold,
    token: multiSigSession.session_token,
    txns: multiSigSession.txns,
    membersThatSigned: multiSigSession.members_that_signed,
    minimumSignatures: multiSigSession.minimum_signatures,
  };
};

import { Token } from './token.entity';
import { User } from './user.entity';
import { Event } from './event.entity';
import { EventRegistration } from './event-registration.entity';
import { CustomerEnquiry } from './customer-enquiry.entity';
import { Multisig } from './multisig.entity';

export const entities = [
  Token,
  User,
  Event,
  EventRegistration,
  CustomerEnquiry,
  Multisig,
];

export { Token, User, Event, EventRegistration, CustomerEnquiry };

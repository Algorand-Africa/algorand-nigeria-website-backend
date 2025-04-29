import { Token } from './token.entity';
import { User } from './user.entity';
import { Event } from './event.entity';
import { EventRegistration } from './event-registration.entity';
import { CustomerEnquiry } from './customer-enquiry.entity';
import { Multisig } from './multisig.entity';
import { MultisigSession } from './multisig-session.entity';
import { Comment } from './comment.entity';
import { ForumCategory } from './forum-category.entity';

export const entities = [
  Token,
  User,
  Event,
  EventRegistration,
  CustomerEnquiry,
  Multisig,
  MultisigSession,
  Comment,
  ForumCategory,
];

export { Token, User, Event, EventRegistration, CustomerEnquiry };

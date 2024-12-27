import { User } from '../../user/entities/user.entity';

export interface TokenPayloadInterface {
  user: Partial<User>;
  iat: number;
  exp: number;
}

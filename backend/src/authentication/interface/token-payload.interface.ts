import { Users } from '../entities/users.entity';

export interface TokenPayloadInterface {
  user: Partial<Users>;
  iat: number;
  exp: number;
}

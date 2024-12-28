import { UserWithoutPassword } from '../../user/types/user.type';
import { UserRole } from '../../user/enums/role.enum';

/**
 * JWT 페이로드 인터페이스입니다.
 */
export interface JwtPayloadInterface {
  user: UserWithoutPassword;
  roles: UserRole[];
  iat: number;
  exp: number;
  sub: number;
  aud: string;
  iss: string;
}

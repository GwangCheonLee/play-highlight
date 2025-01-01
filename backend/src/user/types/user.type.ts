import { User } from '../entities/user.entity';

/**
 * 비밀번호를 제외한 사용자 정보 타입입니다.
 */
export type UserWithoutPassword = Omit<User, 'password'>;

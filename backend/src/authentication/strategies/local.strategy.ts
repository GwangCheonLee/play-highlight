import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { GuardTypeEnum } from './guard-type.enum';
import { UserRepository } from '../../user/repositories/user.repository';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  GuardTypeEnum.LOCAL,
) {
  constructor(private readonly usersRepository: UserRepository) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    return await this.usersRepository.verifyUserByEmailAndPassword(
      email,
      password,
    );
  }
}

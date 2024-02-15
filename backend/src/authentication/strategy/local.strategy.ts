import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { GuardTypeEnum } from './guard-type.enum';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  GuardTypeEnum.LOCAL,
) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    return await this.usersRepository.verifyUserByEmailAndPassword(
      email,
      password,
    );
  }
}

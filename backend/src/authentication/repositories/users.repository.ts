import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Users } from '../entities/users.entity';
import { decryptPlainText } from '../../common/common.constant';

@Injectable()
export class UsersRepository extends Repository<Users> {
  constructor(private dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  async checkEmailExists(email: string) {
    const queryBuilder = this.createQueryBuilder('user').where(
      'user.email = :email',
      {
        email,
      },
    );
    const user = await queryBuilder.getOne();

    return !!user;
  }

  async verifyUserByEmailAndPassword(email: string, plainPassword: string) {
    const queryBuilder = this.createQueryBuilder('users').where(
      'users.email = :email',
      { email },
    );

    const user = await queryBuilder.getOne();

    const isPasswordValid =
      user && (await decryptPlainText(plainPassword, user.password));

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return user;
  }

  async getUserById(userId: number) {
    const queryBuilder = this.createQueryBuilder('user').where(
      'user.id = :userId',
      { userId },
    );

    const user = await queryBuilder.getOne();

    if (!user) {
      throw new NotFoundException('Not found User');
    }

    return user;
  }
}

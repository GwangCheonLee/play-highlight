import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { decryptPlainText } from '../../common/constant/common.constant';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
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
    const queryBuilder = this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .andWhere('user.isDisabled = :isDisabled', { isDisabled: false });

    const user = await queryBuilder.getOne();

    const isPasswordValid =
      user && (await decryptPlainText(plainPassword, user.password));

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return user;
  }

  async getUserById(userId: string) {
    const queryBuilder = this.createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .andWhere('user.isDisabled = :isDisabled', { isDisabled: false });

    const user = await queryBuilder.getOne();

    if (!user) {
      throw new NotFoundException('Not found User');
    }

    return user;
  }
}

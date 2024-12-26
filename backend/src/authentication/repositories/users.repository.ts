import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Users } from '../entities/users.entity';
import { cryptPlainText, decryptPlainText } from '../../common/common.constant';
import { USER_ROLE } from '../../common/enums/role.enum';

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

  async getUserById(userId: number) {
    const queryBuilder = this.createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .andWhere('user.isDisabled = :isDisabled', { isDisabled: false });

    const user = await queryBuilder.getOne();

    if (!user) {
      throw new NotFoundException('Not found User');
    }

    return user;
  }

  async createDefaultUser(
    nickname: string,
    email: string,
    plainPassword: string,
    manager: EntityManager,
  ) {
    const exisingDefaultUser = await manager.findOne(Users, {
      where: { role: USER_ROLE.ADMIN },
    });

    if (exisingDefaultUser) return exisingDefaultUser;

    const originalEmail = email;
    const emailParts = originalEmail.split('@');
    email = `${emailParts}@${emailParts[1]}`;

    const hashedPassword = await cryptPlainText(plainPassword);

    const entity = manager.create(Users, {
      role: USER_ROLE.ADMIN,
      email,
      password: hashedPassword,
      nickname,
      profileImage: null,
    });

    return await manager.save(entity);
  }
}

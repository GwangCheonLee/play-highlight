import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UsersRepository } from './authentication/repositories/users.repository';

@Injectable()
export class AppInitService implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UsersRepository,
  ) {}

  async onModuleInit() {
    await this.createDefaultUser('ADMIN', 'admin@example.com', 'changeme');
  }

  async createDefaultUser(name: string, email: string, plainPassword: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;
    try {
      await this.userRepository.createDefaultUser(
        name,
        email,
        plainPassword,
        manager,
      );
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

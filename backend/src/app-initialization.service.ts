import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserRepository } from './user/repositories/user.repository';

@Injectable()
export class AppInitializationService implements OnModuleInit {
  private readonly logger = new Logger(AppInitializationService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * 모듈이 초기화될 때 실행되는 함수입니다.
   * 서버 실행 시 기본 관리자를 생성합니다.
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Checking for default admin user initialization.');
    await this.initializeDefaultAdmin('ADMIN', 'admin@example.com', 'changeme');
  }

  /**
   * 기본 관리자 계정을 생성하는 함수입니다.
   *
   * @param {string} name - 생성할 계정의 이름
   * @param {string} email - 생성할 계정의 이메일
   * @param {string} plainPassword - 생성할 계정의 비밀번호
   */
  async initializeDefaultAdmin(
    name: string,
    email: string,
    plainPassword: string,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    try {
      const userExists = await this.userRepository.findOneBy({ email });
      if (userExists) {
        this.logger.log('Default admin user already exists.');
        return;
      }

      this.logger.log(`Creating default admin user: ${email}`);
      await this.userRepository.createDefaultUser(
        name,
        email,
        plainPassword,
        manager,
      );
      await queryRunner.commitTransaction();
      this.logger.log('Default admin user created successfully.');
    } catch (error) {
      this.logger.error('Failed to create default admin user.', error.stack);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

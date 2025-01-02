import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { getBaseDir } from '../common/constants/common.constant';
import { Express } from 'express';

/**
 * 사용자 정보를 처리하는 서비스입니다.
 */
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * 현재 로그인한 사용자의 정보를 반환합니다.
   *
   * @param {User} user 현재 로그인한 사용자
   * @param {string} nickname 변경할 닉네임
   * @return {Promise<User>} 현재 로그인한 사용자의 정보
   */
  async changeNickname(user: User, nickname: string): Promise<User> {
    await this.userRepository.update(user.id, { nickname });
    return this.userRepository.findOneBy({ id: user.id });
  }

  async removeProfileImage(user: User) {
    const baseDir = path.join(getBaseDir(), 'profiles');
    const profileDirPath = path.join(baseDir, `${user.id}`);

    if (user.profileImage) {
      fs.unlink(`${profileDirPath}/${user.profileImage}`, () => {});
    }
    await this.userRepository.update(user.id, { profileImage: null });
    return this.userRepository.findOneUserById(user.id);
  }

  async updateProfileImage(user: User, file: Express.Multer.File) {
    const uuid = uuidv4();
    const baseDir = path.join(getBaseDir(), 'profiles');
    const profileDirPath = path.join(baseDir, `${user.id}`);
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuid}${fileExtension}`;

    await this.userRepository.update(user.id, { profileImage: fileName });

    return this.userRepository.findOneUserById(user.id);
  }
}

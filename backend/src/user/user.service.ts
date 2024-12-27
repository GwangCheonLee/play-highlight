import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { getBaseDir } from '../common/constant/common.constant';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async deleteProfileImage(user: User) {
    const baseDir = path.join(getBaseDir(), 'profiles');
    const profileDirPath = path.join(baseDir, `${user.id}`);

    if (user.profileImage) {
      fs.unlink(`${profileDirPath}/${user.profileImage}`, () => {});
    }
    await this.userRepository.update(user.id, { profileImage: null });
    return this.userRepository.getUserById(user.id);
  }

  async saveProfileImage(user: User, file: Express.Multer.File) {
    const uuid = uuidv4();
    const baseDir = path.join(getBaseDir(), 'profiles');
    const profileDirPath = path.join(baseDir, `${user.id}`);
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuid}${fileExtension}`;

    if (user.profileImage) {
      fs.unlink(`${profileDirPath}/${user.profileImage}`, () => {});
    }

    fs.mkdirSync(profileDirPath, { recursive: true });
    fs.writeFileSync(`${profileDirPath}/${fileName}`, file.buffer);

    await this.userRepository.update(user.id, { profileImage: fileName });

    return this.userRepository.getUserById(user.id);
  }

  async changeNickname(user: User, nickname: string) {
    await this.userRepository.update(user.id, { nickname });
    return this.userRepository.findOneBy({ id: user.id });
  }
}

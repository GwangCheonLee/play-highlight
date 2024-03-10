import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../authentication/repositories/users.repository';
import { Users } from '../authentication/entities/users.entity';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { getBaseDir } from '../common/common.constant';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async deleteProfileImage(user: Users) {
    const baseDir = path.join(getBaseDir(), 'profiles');
    const profileDirPath = path.join(baseDir, `${user.id}`);

    if (user.profileImage) {
      fs.unlink(`${profileDirPath}/${user.profileImage}`, () => {});
    }
    await this.usersRepository.update(user.id, { profileImage: null });
    return this.usersRepository.getUserById(user.id);
  }

  async saveProfileImage(user: Users, file: Express.Multer.File) {
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

    await this.usersRepository.update(user.id, { profileImage: fileName });

    return this.usersRepository.getUserById(user.id);
  }

  async changeNickname(user: Users, nickname: string) {
    await this.usersRepository.update(user.id, { nickname });
    return this.usersRepository.findOneBy({ id: user.id });
  }
}

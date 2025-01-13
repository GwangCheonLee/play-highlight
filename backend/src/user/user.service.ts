import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { Express } from 'express';
import { UserRole } from './enums/role.enum';
import { hashPlainText } from '../common/constants/encryption.constant';
import { FileService } from '../file/file.service';
import { FileMetadata } from '../file/file-metadata/entities/file-metadata.entity';
import { FileMetadataService } from '../file/file-metadata/file-metadata.service';
import { ConfigService } from '@nestjs/config';

/**
 * 사용자 정보를 처리하는 서비스입니다.
 */
@Injectable()
export class UserService {
  private readonly bucketName: string;

  constructor(
    configService: ConfigService,
    private readonly fileService: FileService,
    private readonly userRepository: UserRepository,
    private readonly fileMetadataService: FileMetadataService,
  ) {
    this.bucketName = `${configService.get<string>('PROJECT_NAME')}`;
  }

  /**
   * 사용자의 닉네임을 변경합니다.
   *
   * @param {User} user 현재 로그인한 사용자
   * @param {string} nickname 변경할 닉네임
   * @return {Promise<User>} 현재 로그인한 사용자의 정보
   */
  async updateNickname(user: User, nickname: string): Promise<User> {
    if (user.nickname === nickname) {
      return user;
    }

    const existingUser = await this.userRepository.findOneBy({ nickname });

    if (existingUser) {
      throw new ConflictException('Nickname already exists');
    }

    await this.userRepository.update(user.id, { nickname });
    return this.userRepository.findOneBy({ id: user.id });
  }

  /**
   * 사용자의 닉네임을 변경합니다.
   *
   * @param {User} user 현재 로그인한 사용자
   * @param {string} email 변경할 이메일
   * @return {Promise<User>} 현재 로그인한 사용자의 정보
   */
  async updateEmail(user: User, email: string): Promise<User> {
    if (user.email === email) {
      return user;
    }

    const existingUser = await this.userRepository.findOneBy({ email });

    if (existingUser) {
      throw new ConflictException('Nickname already exists');
    }

    await this.userRepository.update(user.id, { email });
    return this.userRepository.findOneBy({ id: user.id });
  }

  /**
   * 사용자의 프로필 이미지를 변경합니다.
   *
   * @param {User} user 현재 로그인한 사용자
   * @param {Express.Multer.File} uploadedFile 변경할 프로필 이미지 파일
   */
  async updateProfileImage(user: User, uploadedFile: Express.Multer.File) {
    if (user.profileImage) {
      console.log(user);
      const previousProfileImageMetadata =
        await this.fileMetadataService.getOneFileMetadata(
          this.bucketName,
          user.profileImage,
          user.id,
        );

      console.log(previousProfileImageMetadata);

      if (previousProfileImageMetadata) {
        console.log('?');
        await this.fileMetadataService.softDeleteFileMetadata(
          previousProfileImageMetadata.key,
        );
      }
    }

    const newProfileImageMetadata: FileMetadata =
      await this.fileService.uploadMulterFileToStorage(uploadedFile, user.id);
    await this.userRepository.update(user.id, {
      profileImage: newProfileImageMetadata.storageLocation,
    });

    return this.userRepository.findOneUserById(user.id);
  }

  /**
   * 사용자의 프로필 이미지를 삭제합니다.
   *
   * @param {User} user 현재 로그인한 사용자
   * @return {Promise<User>} 현재 로그인한 사용자의 정보
   */
  async removeProfileImage(user: User): Promise<User> {
    if (!user.profileImage) {
      return user;
    }

    const previousProfileImageMetadata =
      await this.fileMetadataService.getOneFileMetadata(
        this.bucketName,
        user.profileImage,
        user.id,
      );

    if (previousProfileImageMetadata) {
      await this.fileMetadataService.softDeleteFileMetadata(
        previousProfileImageMetadata.key,
      );
    }

    await this.userRepository.update(user.id, { profileImage: null });
    return this.userRepository.findOneUserById(user.id);
  }

  /**
   * Asset 사용자를 반환하거나 없으면 생성 후 반환합니다.
   *
   * @return {Promise<User>} Asset 사용자
   */
  async getOrCreateAssetUser(): Promise<User> {
    try {
      const assetUser: User = await this.userRepository
        .createQueryBuilder('user')
        .where(':role = ANY(user.roles)', { role: UserRole.ROOT })
        .andWhere('user.nickname = :nickname', { nickname: 'asset' })
        .getOne();

      if (!assetUser) {
        return await this.userRepository.save({
          oauthProvider: null,
          nickname: 'asset',
          email: 'asset@play-highlight.com',
          password: null,
          roles: [UserRole.ROOT],
          profileImage: null,
          isActive: true,
          twoFactorAuthenticationSecret: null,
        });
      }

      return assetUser;
    } catch (error) {
      throw new Error('Failed to get asset user');
    }
  }

  /**
   * Root 사용자가 최소 1명 이상 존재하도록 보장합니다.
   *
   * @return {Promise<void>}
   */
  async ensureRootUsersExist(): Promise<void> {
    try {
      const rootUserList = await this.userRepository
        .createQueryBuilder('user')
        .where(':role = ANY(user.roles)', { role: UserRole.ROOT })
        .andWhere('user.nickname != :nickname', { nickname: 'asset' })
        .getMany();

      if (rootUserList.length === 0) {
        const hashedPassword = await hashPlainText('changeme');

        await this.userRepository.save({
          oauthProvider: null,
          nickname: 'root',
          email: 'root@play-highlight.com',
          password: hashedPassword,
          roles: [UserRole.ROOT],
          profileImage: null,
          isActive: true,
          twoFactorAuthenticationSecret: null,
        });
      }
    } catch (error) {
      throw new Error('Failed to ensure root users exist');
    }
  }
}

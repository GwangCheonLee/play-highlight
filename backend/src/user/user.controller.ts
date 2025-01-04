import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  PayloadTooLargeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user';
import { UpdateNicknameRequestBodyDto } from './dto/update-nickname-request-body.dto';
import { UpdateEmailRequestBodyDto } from './dto/update-email-request-body.dto';
import { JwtAccessGuard } from '../authentication/guards/jwt-access.guard';
import { RedisService } from '../redis/redis.service';
import { ApplicationSettingKeyEnum } from '../application-setting/enums/application-setting-key.enum';

/**
 * 사용자 정보를 처리하는 컨트롤러입니다.
 */
@UseGuards(JwtAccessGuard)
@Controller({ version: '1', path: 'users' })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 현재 로그인한 사용자의 정보를 반환합니다.
   * @param {User} user 현재 로그인한 사용자
   * @return {Promise<User>} 현재 로그인한 사용자의 정보
   */
  @Get('/me')
  async getMe(@GetUser() user: User): Promise<User> {
    return user;
  }

  /**
   * 현재 로그인한 사용자의 닉네임을 변경합니다.
   *
   * @param {User} user 현재 로그인한 사용자
   * @param {UpdateNicknameRequestBodyDto} dto 변경할 닉네임
   * @return {Promise<User>} 변경된 사용자 정보
   */
  @Patch('/me/profile/nickname')
  @HttpCode(200)
  updateNickname(
    @GetUser() user: User,
    @Body() dto: UpdateNicknameRequestBodyDto,
  ): Promise<User> {
    return this.userService.updateNickname(user, dto.nickname);
  }

  /**
   * 현재 로그인한 사용자의 이메일을 변경합니다.
   *
   * @param {User} user 현재 로그인한 사용자
   * @param {UpdateEmailRequestBodyDto} dto 변경할 닉네임
   * @return {Promise<User>} 변경된 사용자 정보
   */
  @Patch('/me/profile/email')
  @HttpCode(200)
  updateEmail(
    @GetUser() user: User,
    @Body() dto: UpdateEmailRequestBodyDto,
  ): Promise<User> {
    return this.userService.updateEmail(user, dto.email);
  }

  /**
   * 현재 로그인한 사용자의 프로필 이미지를 변경합니다.
   *
   * @param {User} user 현재 로그인한 사용자
   * @param {Express.Multer.File} file 변경할 프로필 이미지 파일
   * @return {Promise<User>}  변경된 사용자 정보
   */
  @Patch('/me/profile/image')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('profileImage', { storage: multer.memoryStorage() }),
  )
  async updateProfileImage(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    const uploadProfileImageSizeLimit: number =
      (await this.redisService.getApplicationSetting(
        ApplicationSettingKeyEnum.UPLOAD_PROFILE_IMAGE_SIZE_LIMIT,
      )) as number;

    if (file.size > uploadProfileImageSizeLimit) {
      throw new PayloadTooLargeException('Profile image size is too large');
    }

    return this.userService.updateProfileImage(user, file);
  }

  /**
   * 현재 로그인한 사용자의 프로필 이미지를 삭제합니다.
   *
   * @param {User} user 현재 로그인한 사용자
   * @return {Promise<User>} 변경된 사용자 정보
   */
  @Delete('/me/profile/image')
  @HttpCode(200)
  removeProfileImage(@GetUser() user: User): Promise<User> {
    return this.userService.removeProfileImage(user);
  }
}

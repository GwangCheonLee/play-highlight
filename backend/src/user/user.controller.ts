import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Patch,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express, Response } from 'express';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { User } from './entities/user.entity';
import { JwtAccessGuard } from '../authentication/guards/jwt-access.guard';
import { GetUser } from './decorators/get-user';
import { UpdateNicknameRequestBodyDto } from './dto/update-nickname-request-body.dto';
import { UpdateEmailRequestBodyDto } from './dto/update-email-request-body.dto';

/**
 * 사용자 정보를 처리하는 컨트롤러입니다.
 */
@Controller({ version: '1', path: 'users' })
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  /**
   * 현재 로그인한 사용자의 정보를 반환합니다.
   * @param {User} user 현재 로그인한 사용자
   * @return {Promise<User>} 현재 로그인한 사용자의 정보
   */
  @Get('/me')
  @UseGuards(JwtAccessGuard)
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
  @UseGuards(JwtAccessGuard)
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
  @UseGuards(JwtAccessGuard)
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
   */
  @Patch('/me/profile/image')
  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(
    FileInterceptor('profileImage', { storage: multer.memoryStorage() }),
  )
  async updateProfileImage(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    // const updatedUser = await this.userService.updateProfileImage(user, file);

    return 'true';
  }

  /**
   * 현재 로그인한 사용자의 프로필 이미지를 삭제합니다.
   *
   * @param {User} user 현재 로그인한 사용자
   * @param {Response} response 응답 객체
   */
  @Delete('/me/profile/image')
  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  async removeProfileImage(@GetUser() user: User, @Res() response: Response) {
    const updatedUser = await this.userService.removeProfileImage(user);

    return response.send({
      data: {},
    });
  }
}

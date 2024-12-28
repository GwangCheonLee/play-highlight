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
import { Response } from 'express';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { User } from './entities/user.entity';
import { JwtAccessGuard } from '../authentication/guards/jwt-access.guard';
import { GetUser } from './decorators/get-user';

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

  @Patch('/me/nickname')
  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  async changeNickname(
    @GetUser() user: User,
    @Res() response: Response,
    @Body('nickname') nickname: string,
  ) {
    const updatedUser = await this.userService.changeNickname(user, nickname);

    return response.send({
      data: {},
    });
  }

  @Patch('/me/profile/image')
  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(
    FileInterceptor('profileImage', { storage: multer.memoryStorage() }),
  )
  async changeProfileImage(
    @GetUser() user: User,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatedUser = await this.userService.saveProfileImage(user, file);

    return response.send({
      data: {},
    });
  }

  @Delete('/me/profile/image')
  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  async deleteProfileImage(@GetUser() user: User, @Res() response: Response) {
    const updatedUser = await this.userService.deleteProfileImage(user);

    return response.send({
      data: {},
    });
  }
}

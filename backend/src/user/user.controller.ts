import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Patch,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestByUser } from '../common/decorator/request-by-user.decorator';
import { Response } from 'express';
import { UserService } from './user.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { GuardTypeEnum } from '../authentication/strategies/guard-type.enum';
import { User } from './entities/user.entity';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Patch('/me/nickname')
  @HttpCode(200)
  @UseGuards(AuthGuard(GuardTypeEnum.JWT_ACCESS))
  async changeNickname(
    @RequestByUser() user: User,
    @Res() response: Response,
    @Body('nickname') nickname: string,
  ) {
    const updatedUser = await this.userService.changeNickname(user, nickname);

    const accessToken =
      this.authenticationService.generateAccessToken(updatedUser);
    await this.authenticationService.generateRefreshToken(
      updatedUser,
      response,
    );

    return response.send({
      data: {
        accessToken: accessToken,
      },
    });
  }

  @Patch('/me/profile/image')
  @HttpCode(200)
  @UseGuards(AuthGuard(GuardTypeEnum.JWT_ACCESS))
  @UseInterceptors(
    FileInterceptor('profileImage', { storage: multer.memoryStorage() }),
  )
  async changeProfileImage(
    @RequestByUser() user: User,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatedUser = await this.userService.saveProfileImage(user, file);
    const accessToken =
      this.authenticationService.generateAccessToken(updatedUser);
    await this.authenticationService.generateRefreshToken(
      updatedUser,
      response,
    );

    return response.send({
      data: {
        accessToken: accessToken,
      },
    });
  }

  @Delete('/me/profile/image')
  @HttpCode(200)
  @UseGuards(AuthGuard(GuardTypeEnum.JWT_ACCESS))
  async deleteProfileImage(
    @RequestByUser() user: User,
    @Res() response: Response,
  ) {
    const updatedUser = await this.userService.deleteProfileImage(user);
    const accessToken =
      this.authenticationService.generateAccessToken(updatedUser);
    await this.authenticationService.generateRefreshToken(
      updatedUser,
      response,
    );

    return response.send({
      data: {
        accessToken: accessToken,
      },
    });
  }
}

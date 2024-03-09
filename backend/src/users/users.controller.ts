import {
  Body,
  Controller,
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
import { UsersService } from './users.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { GuardTypeEnum } from '../authentication/strategy/guard-type.enum';
import { Users } from '../authentication/entities/users.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Patch('/me/nickname')
  @HttpCode(200)
  @UseGuards(AuthGuard(GuardTypeEnum.JWT_ACCESS))
  async changeNickname(
    @RequestByUser() user: Users,
    @Res() response: Response,
    @Body('nickname') nickname: string,
  ) {
    const updatedUser = await this.usersService.changeNickname(user, nickname);

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
    @RequestByUser() user: Users,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatedUser = await this.usersService.saveProfileImage(user, file);
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

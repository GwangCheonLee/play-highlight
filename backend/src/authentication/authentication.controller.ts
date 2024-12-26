import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthGuard } from '@nestjs/passport';
import { GuardTypeEnum } from './strategy/guard-type.enum';
import { RequestByUser } from '../common/decorator/request-by-user.decorator';
import { SignUpDto } from './dto/signUp.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';

@Controller('api/authentication')
export class AuthenticationController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto, @Res() response: Response) {
    const signUpEnabled = this.configService.get<boolean>('SIGN_UP_ENABLED');
    if (!signUpEnabled) {
      throw new BadRequestException('Membership is not currently permitted.');
    }

    const user = await this.authenticationService.signUp(signUpDto);
    const accessToken = this.authenticationService.generateAccessToken(user);
    await this.authenticationService.generateRefreshToken(user, response);

    response.send({
      data: {
        accessToken,
      },
    });
  }

  @Post('/sign-in')
  @HttpCode(200)
  @UseGuards(AuthGuard(GuardTypeEnum.LOCAL))
  async signIn(@RequestByUser() user: User, @Res() response: Response) {
    const accessToken = this.authenticationService.generateAccessToken(user);
    await this.authenticationService.generateRefreshToken(user, response);

    return response.send({
      data: {
        accessToken: accessToken,
      },
    });
  }

  @Post('/sign-out')
  @HttpCode(200)
  @UseGuards(AuthGuard(GuardTypeEnum.JWT_ACCESS))
  async signOut(@RequestByUser() user: User, @Res() response: Response) {
    response.cookie('refreshToken', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
    });
    return response.status(204).send();
  }

  @Get('/access-token')
  @UseGuards(AuthGuard(GuardTypeEnum.JWT_REFRESH))
  getAccessTokenByRefreshToken(
    @RequestByUser() user: User,
    @Req() req: Request,
  ) {
    return {
      data: {
        accessToken: this.authenticationService.generateAccessToken(user),
      },
    };
  }
}

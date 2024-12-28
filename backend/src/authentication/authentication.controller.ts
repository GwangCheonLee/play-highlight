import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RequestByUser } from '../common/decorator/request-by-user.decorator';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { User } from '../user/entities/user.entity';
import { LocalGuard } from './guards/local.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { SignUpRequestBodyDto } from './dto/sign-up-request-body.dto';

@Controller('api/authentication')
export class AuthenticationController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('/sign-up')
  async signUp(
    @Body() signUpRequestBodyDto: SignUpRequestBodyDto,
    @Res() response: Response,
  ) {
    const user = await this.authenticationService.signUp(signUpRequestBodyDto);
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
  @UseGuards(LocalGuard)
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
  @UseGuards(JwtAccessGuard)
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
  @UseGuards(JwtRefreshGuard)
  getAccessTokenByRefreshToken(@RequestByUser() user: User) {
    return {
      data: {
        accessToken: this.authenticationService.generateAccessToken(user),
      },
    };
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthGuard } from '@nestjs/passport';
import { GuardTypeEnum } from './strategy/guard-type.enum';
import { RequestByUser } from '../common/decorator/request-by-user.decorator';
import { Users } from './entities/users.entity';
import { SignUpDto } from './dto/signUp.dto';

@Controller('api/authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authenticationService.signUp(signUpDto);

    return {
      data: {
        accessToken: this.authenticationService.generateAccessToken(user),
        refreshToken:
          await this.authenticationService.generateRefreshToken(user),
      },
    };
  }

  @Post('/sign-in')
  @HttpCode(200)
  @UseGuards(AuthGuard(GuardTypeEnum.LOCAL))
  async signIn(@RequestByUser() user: Users) {
    return {
      data: {
        accessToken: this.authenticationService.generateAccessToken(user),
        refreshToken:
          await this.authenticationService.generateRefreshToken(user),
      },
    };
  }

  @Get('/access-token')
  @UseGuards(AuthGuard(GuardTypeEnum.JWT_REFRESH))
  getAccessTokenByRefreshToken(@RequestByUser() user: Users) {
    return {
      data: {
        accessToken: this.authenticationService.generateAccessToken(user),
      },
    };
  }
}

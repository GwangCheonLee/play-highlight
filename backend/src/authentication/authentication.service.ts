import { ConflictException, Injectable } from '@nestjs/common';
import { hashPlainText } from '../common/constants/encryption.constant';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpRequestBodyDto } from './dto/sign-up-request-body.dto';
import { RedisService } from '../redis/redis.service';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { Binary } from 'typeorm';
import { UserRepository } from '../user/repositories/user.repository';
import { User } from '../user/entities/user.entity';
import { extractPayloadFromUser } from '../user/constants/user.constant';
import { UserWithoutPassword } from '../user/types/user.type';
import { toFileStream } from 'qrcode';
import { ApplicationSettingKeyEnum } from '../application-setting/enums/application-setting-key.enum';

/**
 * 사용자 인증과 관련된 모든 기능을 담당하는 서비스 클래스입니다.
 */
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 유저의 accessToken을 생성하고 Redis에 저장합니다.
   *
   * @param {User} user - 토큰을 생성할 유저
   * @return {Promise<string>} - 생성된 accessToken
   */
  async generateAccessToken(user: User): Promise<string> {
    const accessTokenExpirationTime: number = this.configService.get<number>(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    );

    const accessToken = this.jwtService.sign(
      {
        user: extractPayloadFromUser(user),
        sub: user.id,
      },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${accessTokenExpirationTime}s`,
        issuer: this.configService.get('PROJECT_NAME'),
        audience: user.email,
        algorithm: 'HS256',
      },
    );

    const isPreventionEnabled: boolean =
      await this.redisService.getApplicationSetting(
        ApplicationSettingKeyEnum.DUPLICATE_LOGIN_PREVENTION,
      );

    if (isPreventionEnabled) {
      await this.redisService.setUserAccessToken(user.id, accessToken);
    }

    return accessToken;
  }

  /**
   * 유저의 refreshToken을 생성하고 Redis에 저장합니다.
   *
   * @param {User} user - 토큰을 생성할 유저
   * @return {Promise<string>} - 생성된 refreshToken
   */
  async generateRefreshToken(user: User): Promise<string> {
    const refreshTokenExpirationTime: number = this.configService.get<number>(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );

    const refreshToken = this.jwtService.sign(
      {
        user: extractPayloadFromUser(user),
        sub: user.id,
      },
      {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${refreshTokenExpirationTime}s`,
        issuer: this.configService.get('PROJECT_NAME'),
        audience: user.email,
        algorithm: 'HS256',
      },
    );

    const isPreventionEnabled: boolean =
      await this.redisService.getApplicationSetting(
        ApplicationSettingKeyEnum.DUPLICATE_LOGIN_PREVENTION,
      );

    if (isPreventionEnabled) {
      await this.redisService.setUserRefreshToken(user.id, refreshToken);
    }

    return refreshToken;
  }

  /**
   * 회원 가입 로직.
   *
   * @param {SignUpRequestBodyDto} signUpRequestBodyDto - 회원 가입 요청 데이터
   * @return {Promise<UserWithoutPassword>} - 회원 가입 후 인증된 사용자 데이터
   */
  async signUp(signUpRequestBodyDto: SignUpRequestBodyDto): Promise<User> {
    const isSignUpRestriction: boolean =
      await this.redisService.getApplicationSetting(
        ApplicationSettingKeyEnum.SIGN_UP_RESTRICTION,
      );

    if (isSignUpRestriction) {
      throw new ConflictException(
        'Sign up is restricted. Please try again later.',
      );
    }

    const emailExists = await this.userRepository.isEmailRegistered(
      signUpRequestBodyDto.email,
    );

    if (emailExists) {
      throw new ConflictException(
        'This email is already registered. Please use another email.',
      );
    }

    const hashedPassword = await hashPlainText(signUpRequestBodyDto.password);

    return await this.userRepository.signUp(
      signUpRequestBodyDto.email,
      hashedPassword,
      signUpRequestBodyDto.nickname,
    );
  }

  /**
   * Google 인증된 사용자 정보를 통해 로그인 또는 회원가입을 처리합니다.
   *
   * @param {Partial<User>} user - Google 인증된 사용자 정보
   * @return {Promise<User>} - 인증된 사용자 정보 반환
   */
  async googleSignIn(user: Partial<User>): Promise<User> {
    // 이메일로 기존 회원 확인
    const registeredUser = await this.userRepository.isEmailRegistered(
      user.email,
    );

    if (!registeredUser) {
      const isSignUpRestriction: boolean =
        await this.redisService.getApplicationSetting(
          ApplicationSettingKeyEnum.SIGN_UP_RESTRICTION,
        );

      if (isSignUpRestriction) {
        throw new ConflictException(
          'Sign up is restricted. Please try again later.',
        );
      }

      // 새 사용자 등록 후 반환
      return this.userRepository.save({
        oauthProvider: user.oauthProvider,
        email: user.email,
        nickname: user.nickname,
        profileImage: user.profileImage,
      });
    } else {
      // 기존 사용자 반환
      return this.userRepository.findUserByEmail(user.email);
    }
  }

  /**
   * 사용자의 2단계 인증 비밀키를 생성합니다.
   * @param {User} user - 2단계 인증을 설정할 사용자
   * @return {Promise<{secret: string, otpauthUrl: string}>} - 생성된 비밀키와 OTP URL
   */
  async generateTwoFactorAuthenticationSecret(
    user: User,
  ): Promise<{ secret: string; otpauthUrl: string }> {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );

    await this.userRepository.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }

  /**
   * 2단계 인증 QR 코드를 생성합니다.
   *
   * @param {Response} stream - HTTP 응답 객체
   * @param {string} otpauthUrl - OTP URL
   * @return {Promise<Binary>} - QR 코드를 반환합니다.
   */
  async pipeQrCodeStream(
    stream: Response,
    otpauthUrl: string,
  ): Promise<Binary> {
    return toFileStream(stream, otpauthUrl);
  }
}

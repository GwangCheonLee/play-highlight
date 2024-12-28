import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GuardTypeEnum } from '../enums/guard-type.enum';

/**
 * JWT Refresh Token을 사용하는 인증 가드입니다.
 */
@Injectable()
export class JwtRefreshGuard extends AuthGuard(GuardTypeEnum.JWT_REFRESH) {}

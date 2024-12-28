import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GuardTypeEnum } from '../enums/guard-type.enum';

/**
 * JWT Access Token을 사용하는 인증 가드입니다.
 */
@Injectable()
export class JwtAccessGuard extends AuthGuard(GuardTypeEnum.JWT_ACCESS) {}

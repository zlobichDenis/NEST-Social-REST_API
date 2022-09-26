import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRefreshTokenAuthenticationGuard extends AuthGuard(
  'jwt-refresh-token',
) {}

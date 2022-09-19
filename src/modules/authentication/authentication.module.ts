import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { getJwtConfig } from '../../config';
import { UsersModule } from '../users/users.module';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { LocalStrategy, JwtStrategy } from './strategies';

@Module({
  imports: [
      UsersModule,
      PassportModule,
      ConfigModule,
      JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: getJwtConfig
      }),
  ],
  providers: [
      AuthenticationService,
      LocalStrategy,
      JwtStrategy,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { DEFAULT_ERROR_MESSAGE } from '../../shared/constants';
import { PostgresErrorCode } from '../../database/constants';
import { UserEntity } from '../users/entities';
import { UsersService } from '../users/users.service';
import { errorMessages as userErrorMessages } from '../users/constants';
import { errorMessages as authErrorMessages } from './constants';
import { RegisterDto } from './dto';
import { TokenPayload } from './interfaces';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    public async register(dto: RegisterDto): Promise<UserEntity> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
         try {
            const createdUser = await this.usersService.create({
                ...dto,
                password: hashedPassword,
            });

            return createdUser;
         } catch (err) {
            if (err.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException(userErrorMessages.userAlreadyExist, HttpStatus.BAD_REQUEST);
            }

            throw new HttpException(DEFAULT_ERROR_MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR);
         }
    }

    public async login(email: string, passwordHash: string): Promise<UserEntity> {
        try {
            const user = await this.usersService.getByEmail(email);

            await this.verifyPassword(user.password, passwordHash);

            return user;
        } catch (err) {
            throw new HttpException(authErrorMessages.wrongCredentials, HttpStatus.BAD_REQUEST);
        }
    }

    public getCookieWithJwtAccessToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME') + 's',
        });

        const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')};`;

        return {
            cookie,
            token,
        };
    }

    public getCookieWithJwtRefreshToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') + 's',
        });
        const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;

        return {
            cookie,
            token,
        }
    }

    public async getCookieForLogOut() {
        return [
            `Authentication=; HttpOnly; Path=/; Max-Age=0`,
            'Refresh=; HttpOnly; Path=/; Max-Age=0',
        ];
    }

    private async verifyPassword(password: string, passwordHash: string) {
        const isPasswordMatching = await bcrypt.compare(
            passwordHash,
            password,
        );

        if (!isPasswordMatching) {
            throw new HttpException(authErrorMessages.wrongCredentials, HttpStatus.BAD_REQUEST);
        }
    }
}

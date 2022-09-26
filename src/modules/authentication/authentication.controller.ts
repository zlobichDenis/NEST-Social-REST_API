import {
    Body,
    ClassSerializerInterceptor,
    Controller, Get,
    HttpCode,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto';
import { RequestWithUser } from './interfaces';
import { JwtAuthenticationGuard, JwtRefreshTokenAuthenticationGuard, LocalAuthenticationGuard } from './guards';
import { UsersService } from '../users/users.service';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly usersService: UsersService,
    ) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authenticationService.register(dto);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    async login(@Req() request: RequestWithUser) {
        const { user } = request;
        const accessTokenData = this.authenticationService.getCookieWithJwtAccessToken(user.id);
        const refreshTokenData = this.authenticationService.getCookieWithJwtRefreshToken(user.id);

        await this.usersService.setCurrentRefreshToken(refreshTokenData.token, user.id);

        request.res?.setHeader('Set-Cookie', [accessTokenData.cookie, refreshTokenData.cookie]);

        return user;
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('logout')
    async logout(@Req() request: RequestWithUser, @Res() response: Response) {
        const cookie = await this.authenticationService.getCookieForLogOut();
        await this.usersService.deleteRefreshToken(request.user.id);

        response.setHeader('Set-Cookie', cookie);

        return response.sendStatus(200);
    }

    @UseGuards(JwtRefreshTokenAuthenticationGuard)
    @Get('refresh')
    refresh(@Req() request: RequestWithUser) {
        const accessTokenData = this.authenticationService.getCookieWithJwtAccessToken(request.user.id);

        request.res?.setHeader('Set-Cookie', accessTokenData.cookie);

        return request.user;
    }
}

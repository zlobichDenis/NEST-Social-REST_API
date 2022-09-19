import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto';
import { RequestWithUser } from './interfaces';
import { LocalAuthenticationGuard } from './guards';

@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authenticationService.register(dto);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    async login(@Req() { user }: RequestWithUser, @Res() response: Response) {
        const cookie = await this.authenticationService.getCookieWithJwtToken(user.id);
        response.setHeader('Set-Cookie', cookie);

        return response.send(user);
    }

    @Post('logout')
    async logout(@Req() request: RequestWithUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', await this.authenticationService.getCookieForLogOut());
        return response.sendStatus(200);
    }
}

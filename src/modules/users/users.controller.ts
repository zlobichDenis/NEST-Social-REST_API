import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthenticationGuard } from '../authentication/guards';
import { UsersService } from './users.service';
import { RequestWithUser } from '../authentication/interfaces';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Post('avatar')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    // @ts-ignore
    async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
        return this.usersService.addAvatar(request.user.id, file.buffer, file.originalname);
    }
}

import { Controller, Delete, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
    async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: any) {
        return this.usersService.addAvatar(request.user.id, file.buffer, file.originalname);
    }

    @Post('files')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    async addFile(@Req() request: RequestWithUser, @UploadedFile() file: any) {
        return this.usersService.addPrivateFile(request.user.id, file.buffer, file.originalname);
    }

    @Delete('files:fileId')
    @UseGuards(JwtAuthenticationGuard)
    async deleteFile(@Req() request: RequestWithUser, @Param('fileId') fileId: number) {
        return this.usersService.deletePrivateFile(request.user.id, fileId);
    }
}

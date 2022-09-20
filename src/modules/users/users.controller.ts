import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { JwtAuthenticationGuard } from '../authentication/guards';
import { UsersService } from './users.service';
import { RequestWithUser } from '../authentication/interfaces';
import { FindOneParams } from '../../utils';

@UseGuards(JwtAuthenticationGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Post('avatar')
    @UseInterceptors(FileInterceptor('file'))
    async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: any) {
        return this.usersService.addAvatar(request.user.id, file.buffer, file.originalname);
    }

    @Post('files')
    @UseInterceptors(FileInterceptor('file'))
    async addFile(@Req() request: RequestWithUser, @UploadedFile() file: any) {
        return this.usersService.addPrivateFile(request.user.id, file.buffer, file.originalname);
    }

    @Delete('files:id')
    async deleteFile(@Req() request: RequestWithUser, @Param() { id }: FindOneParams) {
        return this.usersService.deletePrivateFile(request.user.id, Number(id));
    }

    @Get('files:id')
    async getPrivateFile(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Param() id: FindOneParams,
    ) {
        const file = await this.usersService.getPrivateFile(request.user.id, Number(id));
        file.stream.pipe(response);
    }

    @Get('files')
    async getAllPrivateFiles(@Req() request: RequestWithUser) {
        return this.usersService.getAllPrivateFiles(request.user.id);
    }
}

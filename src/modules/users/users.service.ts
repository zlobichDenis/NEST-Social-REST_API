import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PublicFileEntity } from '../files/entities';
import { FilesService } from '../files/files.service';
import { UserEntity } from './entities';
import { errorMessages } from './constants';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        private readonly filesService: FilesService,
    ) {}

    async getByEmail(email: string): Promise<UserEntity> {
        const user = await this.usersRepository.findOneBy({ email });

        if (!user) {
            throw new HttpException(errorMessages.userNotFound, HttpStatus.NOT_FOUND);
        }

        return user;
    }

    async getById(id: number): Promise<UserEntity> {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            throw new HttpException(errorMessages.userAlreadyExistById, HttpStatus.NOT_FOUND);
        }

        return user;
    }

    async create(dto: CreateUserDto): Promise<UserEntity> {
        const newUser = await this.usersRepository.create(dto);
        await this.usersRepository.save(newUser);

        return newUser;
    }

    async addAvatar(userId: number, imageBuffer: Buffer, filename: string): Promise<PublicFileEntity> {
        const user = await this.getById(userId);

        if (user.avatar) {
            await this.usersRepository.update(userId, {
                ...user,
                avatar: undefined,
            });
            await this.filesService.deletePublicFile(user.avatar.id);
        }

        const avatar = await this.filesService.uploadPublicFile(imageBuffer, filename);
        await this.usersRepository.update(userId, {
            ...user,
            avatar,
        });

        return avatar;
    }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { PrivateFilesService } from '../private-files/private-files.service';
import { PublicFileEntity } from '../files/entities';
import { FilesService } from '../files/files.service';
import { UserEntity } from './entities';
import { errorMessages } from './constants';
import { CreateUserDto } from './dto';
import { PrivateFileEntity } from '../private-files/entities';
import { UserNotFoundException } from './exceptions';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        private readonly filesService: FilesService,
        private readonly privateFilesService: PrivateFilesService,
        private readonly dataSource: DataSource,
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

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<UserEntity | undefined> {
        const user = await this.getById(userId);

         const isRefreshTokenMatches = user.currentHashedRefreshToken
             && await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);

         if (isRefreshTokenMatches) {
             return user;
         }
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

    async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string): Promise<PrivateFileEntity> {
        return this.privateFilesService.uploadPrivateFile(imageBuffer, userId, filename);
    }

    async deletePrivateFile(userId: number, fileId: number): Promise<void> {
        return this.privateFilesService.deletePrivateFile(fileId, userId);
    }

    async getPrivateFile(userId: number, fileId: number) {
        return await this.privateFilesService.getPrivateFile(fileId, userId);
    }

    async getAllPrivateFiles(userId: number) {
        const userWithFiles = await this.usersRepository.findOne({
            where: {
                id: userId,
            },
            relations: ['files'],
        });

        if (!userWithFiles) {
            throw new UserNotFoundException();
        }

        return Promise.all([
            userWithFiles.files.map(async (file) => {
                const url = await this.privateFilesService.getPreassignedUrl(file.key);
                return {
                    ...file,
                    url,
                };
            })
        ]);
    }

    async setCurrentRefreshToken(token: string, userId: number) {
        const currentHashedRefreshToken = await bcrypt.hash(token, 10);
        await this.usersRepository.update(userId, {
            currentHashedRefreshToken,
        })
    }

    async deleteRefreshToken(userId: number) {
        return this.usersRepository.update(userId, {
            currentHashedRefreshToken: undefined,
        });
    }

    async deleteAvatar(userId: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        const user = await this.getById(userId);

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.update(UserEntity, userId, {
                ...user,
                avatar: undefined,
            });

            if (user.avatar?.id) {
                await this.filesService.deletePublicFileWithQueryRunner(user.avatar.id, queryRunner.manager);
            }

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}

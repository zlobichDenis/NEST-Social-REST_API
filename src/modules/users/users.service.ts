import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities';
import { errorMessages } from './constants';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
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
}

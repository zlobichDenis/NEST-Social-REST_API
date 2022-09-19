import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { MIN_PASS_LENGTH } from '../../authentication/constants';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(MIN_PASS_LENGTH)
    password: string;
}
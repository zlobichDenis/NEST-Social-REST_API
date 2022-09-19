import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

import { MIN_PASS_LENGTH } from '../constants';

export class RegisterDto {
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
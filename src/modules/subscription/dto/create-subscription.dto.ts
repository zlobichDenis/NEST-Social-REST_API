import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
    @IsEmail()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public name: string;
}
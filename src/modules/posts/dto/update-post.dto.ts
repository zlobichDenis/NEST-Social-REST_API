import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
    @IsNumber()
    id: number;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    content: string;
}
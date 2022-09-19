import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCategoryDto {
    @IsNumber()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}
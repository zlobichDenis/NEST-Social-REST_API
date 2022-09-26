import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParams {
    @IsOptional()
    @Min(0)
    @IsNumber()
    @Type(() => Number)
    offset?: number;

    @IsOptional()
    @Min(1)
    @IsNumber()
    @Type(() => Number)
    limit?: number;
}
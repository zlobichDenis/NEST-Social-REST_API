import {
    Controller,
    Post,
    Get,
    Delete,
    Put,
    Param,
    Body,
    UseGuards,
    Req,
    Query,
} from '@nestjs/common';

import { FindOneParams, PaginationParams } from '../../utils';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { JwtAuthenticationGuard } from '../authentication/guards';
import { RequestWithUser } from '../authentication/interfaces';

@UseGuards(JwtAuthenticationGuard)
@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) {}

    @Get()
    async getPosts(
        @Query('search') search: string,
        @Query() { offset, limit }: PaginationParams,
    ) {
        if (!search) {
            return this.postsService.getAllPosts({ offset, limit });
        }

        return this.postsService.searchForPosts(search, { offset, limit });
    }

    @Get(':id')
    async getPostById(@Param() { id }: FindOneParams) {
        return this.postsService.getPostById(Number(id));
    }

    @Post('create')
    async createPost(@Body() dto: CreatePostDto, @Req() request: RequestWithUser) {
        return this.postsService.createPost(dto, request.user);
    }

    @Put(':id')
    async updatePost(@Param() { id }: FindOneParams, @Body() dto: UpdatePostDto) {
        return this.postsService.updatePost(Number(id), dto);
    }

    @Delete(':id')
    async deletePost(@Param() { id }: FindOneParams) {
        return this.postsService.deletePost(Number(id));
    }
}

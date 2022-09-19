import {
    Controller,
    Post,
    Get,
    Delete,
    Put,
    Param,
    Body,
} from '@nestjs/common';

import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) {}

    @Get()
    async getAllPosts() {
        return this.postsService.getAllPosts();
    }

    @Get(':id')
    async getPostById(@Param('id') id: string) {
        return this.postsService.getPostById(id);
    }

    @Post()
    async createPost(@Body() dto: CreatePostDto) {
        return this.postsService.createPost(dto);
    }

    @Put(':id')
    async updatePost(@Param('id') id: string, @Body() dto: UpdatePostDto) {
        return this.postsService.updatePost(id, dto);
    }

    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        return this.postsService.deletePost(id);
    }
}

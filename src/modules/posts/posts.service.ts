import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
    async getAllPosts(): Promise<[]> {
        return [];
    }

    async getPostById(id: string): Promise<string> {
        return id;
    }

    async createPost(dto: CreatePostDto): Promise<null> {
        return null;
    }

    async updatePost(id: string, dto: UpdatePostDto): Promise<null> {
        return null;
    }

    async deletePost(id: string): Promise<null> {
        return null;
    }
}

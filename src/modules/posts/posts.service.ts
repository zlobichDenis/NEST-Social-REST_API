import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdatePostDto, CreatePostDto } from './dto';
import { PostEntity } from './entities';
import { errorMessages } from './constants';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity)
        private postsRepository: Repository<PostEntity>,
    ) {
    }

    async getAllPosts(): Promise<PostEntity[]> {
        return this.postsRepository.find();
    }

    async getPostById(id: number): Promise<PostEntity> {
        const post = await this.postsRepository.findOneBy({ id });

        if(!post) {
            throw new HttpException(errorMessages.postNotFound, HttpStatus.NOT_FOUND);
        }

        return post;
    }

    async createPost(dto: CreatePostDto): Promise<PostEntity> {
        const newPost = await this.postsRepository.save(dto);
        await this.postsRepository.save(newPost);

        return newPost;
    }

    async updatePost(id: number, dto: UpdatePostDto): Promise<PostEntity> {
        await this.postsRepository.update(id, dto);
        const updatedPost = await this.postsRepository.findOneBy({ id });

        if (!updatedPost) {
            throw new HttpException(errorMessages.postNotFound, HttpStatus.NOT_FOUND);
        }

        return updatedPost;
    }

    async deletePost(id: number): Promise<void> {
        const deletedPost = await this.postsRepository.delete(id);

        if (!deletedPost.affected) {
            throw new HttpException(errorMessages.postNotFound, HttpStatus.NOT_FOUND);
        }
    }
}

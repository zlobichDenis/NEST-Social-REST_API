import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../users/entities';
import { UpdatePostDto, CreatePostDto } from './dto';
import { PostEntity } from './entities';
import { PostNotFound } from './exceptions';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity)
        private postsRepository: Repository<PostEntity>,
    ) {
    }

    async getAllPosts(): Promise<PostEntity[]> {
        return this.postsRepository.find({ relations: ['author']});
    }

    async getPostById(id: number): Promise<PostEntity> {
        const post = await this.postsRepository.findOne(
            {
                where: {
                    id,
                },
                relations: ['author'],
            });

        if(!post) {
            throw new PostNotFound(id);
        }

        return post;
    }

    async createPost(dto: CreatePostDto, user: UserEntity): Promise<PostEntity> {
        const newPost = await this.postsRepository.create({
            ...dto,
            author: user,
        });
        await this.postsRepository.save(newPost);

        return newPost;
    }

    async updatePost(id: number, dto: UpdatePostDto): Promise<PostEntity> {
        await this.postsRepository.update(id, dto);
        const updatedPost = await this.postsRepository.findOne({
            where: {
                id,
            },
            relations: ['author'],
        });

        if (!updatedPost) {
            throw new PostNotFound(id);
        }

        return updatedPost;
    }

    async deletePost(id: number): Promise<void> {
        const deletedPost = await this.postsRepository.delete(id);

        if (!deletedPost.affected) {
            throw new PostNotFound(id);
        }
    }
}

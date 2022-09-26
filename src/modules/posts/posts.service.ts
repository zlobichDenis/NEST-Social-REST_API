import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { UserEntity } from '../users/entities';
import { UpdatePostDto, CreatePostDto } from './dto';
import { PostEntity } from './entities';
import { PostNotFound } from './exceptions';
import { PostSearchService } from './post-search/post-search.service';
import { PaginationParams } from '../../utils';
import { GetAllPostsResponse } from './types';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postsRepository: Repository<PostEntity>,
        private readonly postSearchService: PostSearchService,
    ) {
    }

    async getAllPosts({ offset, limit }: PaginationParams): Promise<GetAllPostsResponse> {
        const [items, total] = await this.postsRepository.findAndCount({
            relations: ['author'],
            order: {
                id: 'DESC',
            },
            skip: offset,
            take: limit,
        })

        return {
            items,
            total,
            offset,
            limit,
        }
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
        this.postSearchService.indexPost(newPost);

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

        await this.postSearchService.update(updatedPost);

        return updatedPost;
    }

    async deletePost(id: number): Promise<void> {
        const deletedPost = await this.postsRepository.delete(id);

        if (!deletedPost.affected) {
            throw new PostNotFound(id);
        }

        this.postSearchService.delete(id);
    }

    async searchForPosts(text: string, paginationParams: PaginationParams) {
        const results = await this.postSearchService.search(text, paginationParams);
        const ids = results.map((result) => result.id);

        if (!ids.length) {
            return [];
        }

        return this.postsRepository.find({
            where: {
                id: In(ids),
            },
        });
    }

    async getPostsWithParagraphs(paragraph: string) {
        return this.postsRepository.query(`
            SELECT * FROM post 
            WHERE $1 = ANY(paragraphs)
        `, [paragraph]);
    }
}

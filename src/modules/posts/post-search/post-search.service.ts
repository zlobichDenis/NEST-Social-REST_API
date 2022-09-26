import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PostEntity } from '../entities';
import { PostSearchBody, PostSearchResult } from '../types';
import { PaginationParams } from '../../../utils';

@Injectable()
export class PostSearchService {
    index = 'posts';

    constructor(
        private readonly elasticsearchService: ElasticsearchService,
    ) {}

    async indexPost(post: PostEntity) {
        return this.elasticsearchService.index<PostSearchBody>({
            index: this.index,
            body: {
                id: post.id,
                title: post.title,
                content: post.content,
                authorId: post.author.id,
            },
        });
    }

    async search(text: string, { offset, limit }: PaginationParams): Promise<PostSearchBody[]> {
        const { body } = await this.elasticsearchService.search<PostSearchResult>({
            index: this.index,
            from: offset,
            size: limit,
            body: {
                query: {
                    multi_match: {
                      query: text,
                      fields: ['title', 'content'],
                    },
                },
                sort: {
                    id: {
                        order: 'asc',
                    }
                },
            },
        });

        const result = body.hits.hits.map((hit) => hit._source);

        return result;
    }

    async update(post: PostEntity) {
        const newBody = {
            id: post.id,
            title: post.title,
            content: post.content,
            authorId: post.author.id,
        };

        const script = Object.entries(newBody).reduce((result, [key, value]) => {
            return `${result} ctx._source.${key}=${value};`;
        }, '');

        return this.elasticsearchService.updateByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: post.id,
                    },
                },
                script: {
                    inline: script,
                },
            },
        });
    }

    async delete(postId: number) {
        this.elasticsearchService.deleteByQuery({
            index: this.index,
            body: {
                match: {
                    id: postId,
                },
            },
        })
    }
}

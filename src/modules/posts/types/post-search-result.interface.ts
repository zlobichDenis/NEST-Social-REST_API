import { PostSearchBody } from './post-search-body.interface';

export interface PostSearchResult {
    hits: {
        total: number;
        hits: Array<{
            _source: PostSearchBody,
        }>,
    },
}
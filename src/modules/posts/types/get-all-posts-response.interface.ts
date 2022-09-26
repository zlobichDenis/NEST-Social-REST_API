import { ResponseWithPagination } from '../../../shared';
import { PostEntity } from '../entities';

export interface GetAllPostsResponse extends ResponseWithPagination {
    items: PostEntity[];
}
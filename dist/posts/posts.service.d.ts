import { Repository } from 'typeorm';
import PostModel from './entity/posts.entity';
export declare class PostsService {
    private readonly postRepository;
    constructor(postRepository: Repository<PostModel>);
    getAllPosts(): Promise<PostModel[]>;
    getPostById(id: number): Promise<PostModel>;
    createPost(author: string, title: string, content: string): Promise<{
        author: string;
        title: string;
        content: string;
        likeCount: number;
        commentCount: number;
    } & PostModel>;
    updatePost(id: number, author: string, title: string, content: string): Promise<PostModel>;
    deletePost(id: number): Promise<void>;
}

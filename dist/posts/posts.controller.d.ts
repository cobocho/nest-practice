import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    getPosts(): Promise<import("src/posts/entity/posts.entity").default[]>;
    getPost(id: string): Promise<import("src/posts/entity/posts.entity").default>;
    postPost(author: string, title: string, content: string): Promise<{
        author: string;
        title: string;
        content: string;
        likeCount: number;
        commentCount: number;
    } & import("src/posts/entity/posts.entity").default>;
    patchPost(id: string, author: string, title: string, content: string): Promise<import("src/posts/entity/posts.entity").default>;
    deletePost(id: string): Promise<void>;
}

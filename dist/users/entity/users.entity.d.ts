import { RolesEnum } from '../const/roles.const';
import PostsModel from 'src/posts/entity/posts.entity';
export declare class UsersModel {
    id: number;
    nickname: string;
    email: string;
    password: string;
    role: RolesEnum;
    posts: PostsModel[];
}

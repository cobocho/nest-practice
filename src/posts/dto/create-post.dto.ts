import PostModel from '../entity/posts.entity';
import { PickType } from '@nestjs/mapped-types';

export class createPostDto extends PickType(PostModel, ['title', 'content']) {}

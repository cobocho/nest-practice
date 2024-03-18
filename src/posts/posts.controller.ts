import { Controller, Get } from '@nestjs/common';
import { PostModel } from 'src/types/Post';

const posts: PostModel[] = [
  {
    id: 1,
    author: 'newjeans_official',
    title: '뉴진스 민지',
    content: '메이크업 고치는 민지',
    likeCount: 10000,
    commentCount: 9999,
  },
  {
    id: 2,
    author: 'newjeans_official',
    title: '뉴진스 해린',
    content: '메이크업 고치는 해린',
    likeCount: 10000,
    commentCount: 9999,
  },
];

@Controller('posts')
export class PostsController {
  @Get()
  getPost(): PostModel[] {
    return posts;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostModel } from './entities/posts.entities';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
  ) {}

  async getAllPosts() {
    return this.postRepository.find();
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async createPost(author: string, title: string, content: string) {
    const post = {
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };

    this.postRepository.insert(post);

    const newPost = await this.postRepository.save(post);

    return newPost;
  }

  async updatePost(id: number, author: string, title: string, content: string) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (author) {
      post.author = author;
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    const newPost = await this.postRepository.save(post);

    return newPost;
  }

  async deletePost(id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    this.postRepository.delete(post);
  }
}

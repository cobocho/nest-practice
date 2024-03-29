import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import PostModel from './entity/posts.entity';
import { createPostDto } from './dto/create-post.dto';
import { updatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { HOST, PROTOCOL } from 'src/common/const/env.const';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find();
  }

  async generatePosts() {
    for (let i = 0; i < 100; i++) {
      await this.createPost(1, {
        title: `임의로 생성된 포스트 ${i}`,
        content: `임의로 생성된 포스트 콘텐츠 ${i}`,
      });
    }
  }

  async paginatePosts(dto: PaginatePostDto) {
    const where: FindOptionsWhere<PostModel> = {};

    if (dto.where__id_more_than) {
      where.id = MoreThan(dto.where__id_more_than);
    }

    if (dto.where__id_less_than) {
      where.id = LessThan(dto.where__id_less_than);
    }

    const posts = await this.postsRepository.find({
      where,
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });
    const lastItem = posts.length > 0 ? posts.at(-1) : null;

    const nextUrl = lastItem ? new URL(`${PROTOCOL}://${HOST}/posts?where`) : null;

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (key !== 'where__id_more_than' && key === 'ASC') {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }
    }

    let key = null;

    if (dto.order__createdAt === 'ASC') {
      key = 'where_id_more_than';
    } else {
      key = 'where_id_less_than';
    }

    nextUrl?.searchParams.append(key, lastItem.id.toString());

    return {
      data: posts,
      cursor: {
        after: lastItem,
      },
      count: posts.length,
      next: nextUrl ? nextUrl.toString() : null,
    };
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async createPost(authorId: number, postDto: createPostDto) {
    // 1) create -> 저장할 객체를 생성한다.
    // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async updatePost(postId: number, updateDto: updatePostDto) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (updateDto.title) {
      post.title = updateDto.title;
    }

    if (updateDto.content) {
      post.content = updateDto.content;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost(postId: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(postId);

    return postId;
  }

  async checkPostExistsById(id: number) {
    return this.postsRepository.exist({
      where: {
        id,
      },
    });
  }
}

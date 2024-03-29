import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import PostModel from './entity/posts.entity';
import { createPostDto } from './dto/create-post.dto';
import { updatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
    private readonly commonService: CommonService,
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
    return this.commonService.paginate(dto, this.postsRepository, {}, 'posts');
  }

  async pagePaginatePosts(dto: PaginatePostDto) {
    const [posts, count] = await this.postsRepository.findAndCount({
      order: {
        createdAt: dto.order__createdAt,
      },
      skip: dto.take * (dto.page - 1),
      take: dto.take,
    });

    return {
      data: posts,
      total: count,
    };
  }

  async cursorPaginatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(dto, this.postsRepository);
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

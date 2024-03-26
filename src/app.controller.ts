import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import PostModel from './entity/post.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
  ) {}

  @Get('users')
  getUsers() {
    return this.userRepository.find();
  }

  @Post('users')
  createUser() {
    return this.userRepository.save({
      email: 'test@naver.com',
    });
  }

  @Post('users/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'asdf@naver.com',
    });

    await this.profileRepository.save({
      profileImg: 'asdf.jpg',
      user,
    });

    return user;
  }

  @Patch('users/:id')
  async editUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: +id,
      },
    });

    return this.userRepository.save({
      ...user,
    });
  }

  @Post('users/post')
  async createUserPost() {
    const user = await this.userRepository.save({
      email: 'post@code.com',
    });

    await this.postRepository.save({
      title: 'post1',
      author: user,
    });

    await this.postRepository.save({
      title: 'post2',
      author: user,
    });

    return user;
  }
}

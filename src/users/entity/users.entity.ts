import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import PostsModel from 'src/posts/entity/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';

@Entity()
export class UsersModel extends BaseModel {
  @Column({
    // 1)
    length: 20,
    // 2)
    unique: true,
  })
  nickname: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
}

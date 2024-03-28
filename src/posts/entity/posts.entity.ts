import { UsersModel } from 'src/users/entity/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersModel, (user) => user.posts, {
    eager: true,
  })
  author: UsersModel;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import PostModel from './post.entity';

@Entity()
export default class TagModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => PostModel, (post) => post.tags)
  posts: PostModel[];

  @Column()
  name: string;
}

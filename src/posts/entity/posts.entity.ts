import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { stringValidationMessage } from 'src/common/validation/string-validation.message';
import { UsersModel } from 'src/users/entity/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export default class PostModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    eager: true,
  })
  author: UsersModel;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  title: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}

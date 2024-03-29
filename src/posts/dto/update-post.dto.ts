import { PartialType } from '@nestjs/mapped-types';
import PostModel from '../entity/posts.entity';
import { IsOptional, IsString } from 'class-validator';
import { stringValidationMessage } from 'src/common/validation/string-validation.message';

export class updatePostDto extends PartialType(PostModel) {
  @IsString({
    message: stringValidationMessage,
  })
  @IsOptional()
  title: string;

  @IsString({
    message: stringValidationMessage,
  })
  @IsOptional()
  content: string;
}

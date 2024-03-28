import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: string) {
    if (value.toString().length > 8) {
      throw new BadRequestException('비밀번호는 8자 이하여야 합니다!');
    }

    return value.toString();
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(private readonly length: number) {}

  transform(value: any) {
    if (value.toString().length > this.length) {
      throw new BadRequestException(`최대 길이는 ${this.length}자 이하여야 합니다!`);
    }

    return value.toString();
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly length: number) {}

  transform(value: any) {
    if (value.toString().length < this.length) {
      throw new BadRequestException(`최소 길이는 ${this.length}자 이상이어야 합니다!`);
    }

    return value.toString();
  }
}

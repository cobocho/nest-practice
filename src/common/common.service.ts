import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginateDto } from './dto/base-pagination.dto';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { BaseModel } from './entity/base.entity';
import { HOST, PROTOCOL } from './const/env.const';
import { FILTER_MAPPER } from './const/filter-mapper.const';

@Injectable()
export class CommonService {
  paginate<T extends BaseModel>(
    dto: BasePaginateDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path?: string,
  ) {
    if (dto.page) {
      return this.pagePaginate(dto, repository, overrideFindOptions);
    }
    return this.cursorPaginate(dto, repository, overrideFindOptions, path);
  }

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginateDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    const findOptions = this.composeFindOptions<T>(dto);
    const results = await repository.find({ ...findOptions, ...overrideFindOptions });

    const lastItem =
      results.length > 0 && results.length === dto.take ? results[results.length - 1] : null;

    const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}/${path}`);

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (key !== 'where__id__more_than' && key === 'ASC') {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }
    }

    let key = null;

    if (dto.order__createdAt === 'ASC') {
      key = 'where__id__more_than';
    } else {
      key = 'where__id__less_than';
    }

    nextUrl?.searchParams.append(key, lastItem.id.toString());

    return {
      data: results,
      cursor: {
        after: lastItem,
      },
      count: results.length,
      next: nextUrl ? nextUrl.toString() : null,
    };
  }

  private async pagePaginate<T extends BaseModel>(
    dto: BasePaginateDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    const findOptions = this.composeFindOptions<T>(dto);

    const [posts, count] = await repository.findAndCount({
      ...findOptions,
      ...overrideFindOptions,
      skip: dto.take * (dto.page - 1),
      take: dto.take,
    });

    return {
      data: posts,
      total: count,
    };
  }

  private composeFindOptions<T extends BaseModel>(dto: BasePaginateDto): FindManyOptions<T> {
    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (key.startsWith('where__')) {
        where = {
          ...where,
          ...this.parseWhereFilter<T>(key, value),
        };
      }
      if (key.startsWith('order')) {
        order = {
          ...order,
          ...this.parseWhereFilter<T>(key, value),
        };
      }
    }

    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null,
    };
  }

  private parseWhereFilter<T extends BaseModel>(key: string, value: string): FindOptionsWhere<T> {
    const options: FindOptionsWhere<T> = {};
    const split = key.split('__');

    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(`
        where 필터는 '__'로 split 했을때 길이가 2 또는 3이어야합니다. key=${key}
      `);
    }

    if (split.length === 2) {
      const [, field] = split;
      options[field] = value;
    }

    if (split.length === 3) {
      const [, field, operator] = split;
      const values = value.toString().split(',');

      if (operator === 'i_like') {
        options[field] = FILTER_MAPPER[operator](`%${value}%`);
      } else {
        options[field] = FILTER_MAPPER[operator](...values);
      }
    }

    return options;
  }
}

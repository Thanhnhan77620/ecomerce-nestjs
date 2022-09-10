/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseEntity,
  DeleteResult,
  Repository,
  FindOptionsOrder,
  FindOptionsWhere,
  Like,
  DeepPartial,
} from 'typeorm';
import { IBaseService } from '../interfaces/i.base.service';
import { EntityId } from 'typeorm/repository/EntityId';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseService<T extends BaseEntity, R extends Repository<T>>
  implements IBaseService<T>
{
  protected readonly repository: R;

  constructor(repository: R) {
    this.repository = repository;
  }

  async findManyWithPagination(
    paginationOptions: IPaginationOptions,
    fields?: string,
    wheres?: FindOptionsWhere<T>,
    orders?: FindOptionsOrder<T>,
    likes?: (keyof T)[],
  ) {
    const selects: (keyof T)[] = [];
    if (fields) {
      fields.split(',').forEach((el) => {
        if (el as keyof T) {
          selects.push(el as keyof T);
        }
      });
      selects.push('id' as keyof T);
    }
    if (likes) {
      likes.forEach((el: any) => {
        if (wheres[el]) {
          wheres[el] = Like(`%${wheres[el]}%`);
        }
      });
    }
    console.log('page', paginationOptions);
    return infinityPagination(
      await this.repository.find({
        ...(paginationOptions.page &&
          paginationOptions.limit && {
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
          }),
        ...(paginationOptions.limit && { take: paginationOptions.limit }),
        select: selects,
        where: wheres,
        order: orders,
        cache: true,
      }),
      paginationOptions,
    );
  }

  async findOne(fields: EntityCondition<T>): Promise<T> {
    const entity = await this.repository.findOne({
      where: fields,
    });

    let error = 'with ';
    Object.keys(fields).forEach((key) => {
      error += `${key} = ${fields[key]}`;
    });
    if (!entity) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            notFound: `Entity ${error} not found`,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return entity;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    return await this.repository.save(this.repository.create(data));
  }

  async update(id: EntityId, data: any): Promise<T> {
    try {
      await this.repository.save(
        this.repository.create({ id, ...data }) as any,
      );
      return this.findOne({ id } as unknown as EntityCondition<T>);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            notFound: `Entity with id ${id} not found`,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async delete(id: EntityId): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  changeStatus(id: EntityId) {
    return id;
  }
}

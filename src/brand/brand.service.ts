import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { BaseService } from 'src/shared/services/base.service';
import { DeepPartial, Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandService extends BaseService<Brand, Repository<Brand>> {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    private categoriesService: CategoriesService,
  ) {
    super(brandRepository, 'brand');
  }

  async createWithCategories(data: CreateBrandDto): Promise<Brand> {
    await Promise.all(
      data.categories?.map((id) => {
        return this.categoriesService.findOne({ id });
      }),
    ).then((res) => {
      data.categories = res;
    });

    return super.create(data as DeepPartial<Brand>);
  }
}

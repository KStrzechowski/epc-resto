import { Injectable } from '@nestjs/common';
import { CategoriesDataAccessLayer } from './categories.dal';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesDataAccessLayer: CategoriesDataAccessLayer,
  ) {}

  public async getCategories() {
    return await this.categoriesDataAccessLayer.getCategories();
  }
}

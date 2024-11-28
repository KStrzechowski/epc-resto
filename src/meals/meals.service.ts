import { Injectable } from '@nestjs/common';
import { MealsDataAccessLayer } from './meals.dal';

@Injectable()
export class MealsService {
  constructor(private readonly mealsDataAccessLayer: MealsDataAccessLayer) {}

  public async getMeals(categoryId?: number) {
    return await this.mealsDataAccessLayer.getMeals(categoryId);
  }
}

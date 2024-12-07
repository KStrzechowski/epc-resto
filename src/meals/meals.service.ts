import { Injectable } from '@nestjs/common';
import { MealsDataAccessLayer } from './meals.dal';
import { GetMealsQueryDto } from './dtos';

@Injectable()
export class MealsService {
  constructor(private readonly mealsDataAccessLayer: MealsDataAccessLayer) {}

  public async getMeals(query: GetMealsQueryDto) {
    const { categoryId } = query;

    return await this.mealsDataAccessLayer.getMeals(categoryId);
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { MealsService } from './meals.service';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get('/')
  async getMeals(@Query('category_id') categoryId?: number) {
    return await this.mealsService.getMeals(categoryId);
  }
}

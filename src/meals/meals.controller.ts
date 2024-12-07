import { Controller, Get, Query } from '@nestjs/common';
import { MealsService } from './meals.service';
import { GetMealsQueryDto } from './dtos';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get('/')
  async getMeals(@Query() query: GetMealsQueryDto) {
    return await this.mealsService.getMeals(query);
  }
}

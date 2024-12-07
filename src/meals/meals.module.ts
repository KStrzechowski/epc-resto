import { Module } from '@nestjs/common';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { MealsDataAccessLayer } from './meals.dal';

@Module({
  controllers: [MealsController],
  providers: [MealsService, MealsDataAccessLayer],
  exports: [MealsDataAccessLayer],
})
export class MealsModule {}

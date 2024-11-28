import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesDataAccessLayer } from './categories.dal';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesDataAccessLayer],
})
export class CategoriesModule {}

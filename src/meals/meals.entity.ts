import { Category } from '@categories/categories.entity';

export interface Meal {
  name: string;
  category: Category;
  price: number;
}

export interface MealDbMeal {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
}

export interface MealDbSearchResponse {
  meals: MealDbMeal[] | null;
}

export interface MealDbCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface MealDbCategoriesResponse {
  categories: MealDbCategory[];
}
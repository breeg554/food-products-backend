export type StatusType = "accepted" | "rejected" | "in_progress";
export type RecipeStatusType = "private" | "public" | "rejected" | "in_progress";
export interface TagType {
  name: string;
  _id: string;
}
export interface UnitOfMeasureType {
  name: string;
  _id: string;
}
export interface CategoryType {
  name: string;
  _id: string;
}
export interface ProductType {
  _id: string;
  name: string;
  nutrition: {
    totalSize: number;
    caloricBreakdown: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
    };
    nutrients: {
      calories: {
        amount: number;
        unit: "cal";
        percentOfDailyNeeds: number;
      };
      protein: {
        amount: number;
        unit: "g";
        percentOfDailyNeeds: number;
      };
      fat: {
        amount: number;
        unit: "g";
        percentOfDailyNeeds: number;
      };
      carb: {
        amount: number;
        unit: "g";
        percentOfDailyNeeds: number;
      };
    };
  };
  tags: TagType[];
  category: CategoryType;
  unitOfMeasure: UnitOfMeasureType;
  status: StatusType;
  _authorId: string;
  createdAt: string;
}
export interface RecipeRatingType {
  rateCount: number;
  rateValue: number;
  rateAvg: number;
}
export interface IngredientType {
  product: ProductType;
  amount: number;
}
export interface PreparationStepType {
  instruction: string;
  step: number;
}
export interface NutrientsType {
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}
export interface RecipeType {
  _id: string;
  name: string;
  image: {
    small: string;
    medium: string;
  };
  servings: number;
  readyInMinutes: number;
  isPublic: boolean;
  ingredients: IngredientType[];
  preparation: PreparationStepType[];
  nutrition: {
    caloricBreakdown: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
    };
    nutrients: {
      calories: NutrientsType;
      protein: NutrientsType;
      fat: NutrientsType;
      carb: NutrientsType;
    };
  };
  tags: TagType[];
  dietType: [{ name: string; _id: string }];
  category: CategoryType;
  status: RecipeStatusType;
  rating: RecipeRatingType;
  _authorId: string;
  createdAt: string;
}
export interface RatingType {
  _userId: string;
  _recipeId: string;
  rating: [0, 1, 2, 3, 4, 5];
}

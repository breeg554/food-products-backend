import { NutrientsType } from "../types";
import {
  MEDIUM_CALORIC_DEMAND,
  DAILY_REQUIREMENT_OF_PROTEIN,
  DAILY_REQUIREMENT_OF_CARB,
  DAILY_REQUIREMENT_OF_FAT,
} from "../utils/caloricConsts";
type IngredientType = {
  product: string;
  amount: number;
  nutrients: {
    calories: NutrientsType;
    protein: NutrientsType;
    carb: NutrientsType;
    fat: NutrientsType;
  };
};

export const calculateRecipeNutrition = (nutrients: IngredientType[]) => {
  let calories: NutrientsType = {
    amount: 0,
    unit: "kcal",
    percentOfDailyNeeds: 0,
  };
  let protein: NutrientsType = {
      amount: 0,
      unit: "g",
      percentOfDailyNeeds: 0,
    },
    fat: NutrientsType = {
      amount: 0,
      unit: "g",
      percentOfDailyNeeds: 0,
    },
    carb: NutrientsType = {
      amount: 0,
      unit: "g",
      percentOfDailyNeeds: 0,
    };
  nutrients.forEach((ingredient: IngredientType) => {
    calories.amount += (ingredient.nutrients.calories.amount * ingredient.amount) / 100;
    protein.amount += (ingredient.nutrients.protein.amount * ingredient.amount) / 100;
    carb.amount += (ingredient.nutrients.carb.amount * ingredient.amount) / 100;
    fat.amount += (ingredient.nutrients.fat.amount * ingredient.amount) / 100;
  });
  calories.percentOfDailyNeeds = (calories.amount / MEDIUM_CALORIC_DEMAND) * 100;
  protein.percentOfDailyNeeds = (protein.amount / DAILY_REQUIREMENT_OF_PROTEIN) * 100;
  fat.percentOfDailyNeeds = (fat.amount / DAILY_REQUIREMENT_OF_FAT) * 100;
  carb.percentOfDailyNeeds = (carb.amount / DAILY_REQUIREMENT_OF_CARB) * 100;

  const sumOfCaloricBreakDown = protein.amount * 4 + fat.amount * 9 + carb.amount * 4;
  const caloricBreakdown = {
    percentProtein: sumOfCaloricBreakDown ? ((protein.amount * 4) / sumOfCaloricBreakDown) * 100 : 0,
    percentFat: sumOfCaloricBreakDown ? ((fat.amount * 9) / sumOfCaloricBreakDown) * 100 : 0,
    percentCarbs: sumOfCaloricBreakDown ? ((carb.amount * 4) / sumOfCaloricBreakDown) * 100 : 0,
  };
  return {
    nutrients: {
      calories,
      protein,
      fat,
      carb,
    },
    caloricBreakdown,
  };
};

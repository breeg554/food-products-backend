import { MealPlanDayType, IngredientType } from "../types";

export const getShoppingListIngredientsFromMealPlanDay = (mealPlanDay: MealPlanDayType, list?: IngredientType[]) => {
  if (!mealPlanDay) return [];

  const tmpList: IngredientType[] = [...list] || [];

  mealPlanDay.meals.forEach((meal) => {
    meal.recipe.ingredients.forEach((ing) => {
      const index = tmpList.findIndex((sIng) => sIng.product.toString() === ing.product.toString());
      const amount = (ing.amount / meal.recipe.servings) * meal.servings;
      if (index < 0) tmpList.push({ bought: false, product: ing.product, amount });
      else {
        const tmp = tmpList[index];
        tmp.amount += amount;
        tmpList[index] = tmp;
      }
    });
  });

  return tmpList;
};

export const nutritionProductSort = (column, order) => {
  if (column === "totalWeight")
    return { "nutrition.totalWeight.amount": order === "ascend" ? 1 : -1 };
  else if (
    column === "calories" ||
    column === "protein" ||
    column === "fat" ||
    column === "carb"
  ) {
    const property = `nutrition.nutrients.${column}.amount`;
    return { [property]: order === "ascend" ? 1 : -1 };
  } else return { [column]: order === "ascend" ? 1 : -1 };
};

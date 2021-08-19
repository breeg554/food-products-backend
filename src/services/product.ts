export const nutritionProductSort = (column: string, order: string) => {
  if (column === "totalSize") return { "nutrition.totalSize": order === "ascend" ? 1 : -1 };
  else if (column === "calories" || column === "protein" || column === "fat" || column === "carb") {
    const property = `nutrition.nutrients.${column}.amount`;
    return { [property]: order === "ascend" ? 1 : -1 };
  } else return { [column]: order === "ascend" ? 1 : -1 };
};
export const productStatus = ["accepted", "rejected", "in_progress"];

import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

// ... inside your App component ...
const getRecipeAction = useAction(api.recipe.getRecipe);

const fetchRecipesFromAI = async () => {
  setLoading(true);
  const ingredients = items.map(i => i.name).join(", ");
  
  try {
    const result = await getRecipeAction({ ingredients });
    setRecipes(result.recipes || []);
  } catch (e) {
    console.error(e);
    alert("Something went wrong with the AI!");
  }
  setLoading(false);
};

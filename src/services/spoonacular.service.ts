import axios from 'axios';
require('dotenv').config();

const apiKey = process.env.SPOONACULAR_API_KEY;
const baseURL =  process.env.SPOONACULAR_URL_BASE;

if (!apiKey) {
  throw new Error('SPOONACULAR_API_KEY is missing in .env file');
}

export const getRecipesFromSpoonacular = async (ingredients: string) => {
  try {
    const response = await axios.get(`${baseURL}/recipes/findByIngredients`, {
      params: {
        ingredients,
        number: 10,
        ranking: 2,
        ignorePantry: true,
        apiKey
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Erreur Spoonacular API:', error.message);
    return [];
  }
};

export const getRecipeDetails = async (recipeId: number) => {
  try {
    const response = await axios.get(`${baseURL}/recipes/${recipeId}/information`, {
      params: {
        apiKey,
        includeNutrition: false
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Erreur Spoonacular API (détails recette):', error.message);
    return null;
  }
};

export const getRecipesWithDetails = async (ingredients: string) => {
  try {
  
    const recipes = await getRecipesFromSpoonacular(ingredients);   
    const recipesWithDetails = await Promise.all(
      recipes.map(async (recipe: any) => {
        const details = await getRecipeDetails(recipe.id);
        return {
          ...recipe,
          instructions: details?.instructions || '',
          readyInMinutes: details?.readyInMinutes || 0,
          preparationMinutes: details?.preparationMinutes || 0,
          cookingMinutes: details?.cookingMinutes || 0,
          sourceUrl: details?.sourceUrl || '',
          steps: details?.analyzedInstructions?.[0]?.steps || []
        };
      })
    );
    
    return recipesWithDetails;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des recettes avec détails:', error.message);
    return [];
  }
};

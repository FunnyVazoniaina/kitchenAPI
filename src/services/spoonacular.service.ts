import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.SPOONACULAR_API_KEY;
const baseURL = 'https://api.spoonacular.com';

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

// Nouvelle fonction pour obtenir les détails complets d'une recette
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

// Fonction pour récupérer les recettes avec leurs détails complets
export const getRecipesWithDetails = async (ingredients: string) => {
  try {
    // D'abord, récupérer les recettes de base
    const recipes = await getRecipesFromSpoonacular(ingredients);
    
    // Ensuite, récupérer les détails pour chaque recette
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

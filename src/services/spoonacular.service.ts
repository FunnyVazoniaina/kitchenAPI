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

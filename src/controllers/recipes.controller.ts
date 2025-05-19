import { Request, Response } from 'express';
import { getRecipesFromSpoonacular } from '../services/spoonacular.service';
import { db } from '../config/db';

export const suggestRecipes = async (req: Request, res: Response) => {
  const ingredients = req.query.ingredients as string;
  const recipes = await getRecipesFromSpoonacular(ingredients);
  const userId = (req as any).user?.id;

  // Sauvegarde dans l'historique
  if (userId) {
    await db.query('INSERT INTO search_history (user_id, ingredients) VALUES (?, ?)', [userId, ingredients]);
  }

  res.json(recipes);
};

import { Request, Response } from 'express';
import { db } from '../config/db';

export const addFavorite = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { recipeId, title, image_url } = req.body;

  // On stocke la recette si elle n’existe pas
  await db.query('INSERT IGNORE INTO recipes (id, title, image_url) VALUES (?, ?, ?)', [recipeId, title, image_url]);

  // Ajout au favoris
  await db.query('INSERT IGNORE INTO user_favorites (user_id, recipe_id) VALUES (?, ?)', [userId, recipeId]);

  res.json({ message: 'Recipe added to favorites' });
};

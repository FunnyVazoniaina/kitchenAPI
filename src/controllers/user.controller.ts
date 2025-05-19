import { Request, Response } from 'express';
import { db } from '../config/db';

export const addFavorite = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { recipeId, title, image_url } = req.body;

  // On stocke la recette si elle n'existe pas
  await db.query('INSERT IGNORE INTO recipes (id, title, image_url) VALUES (?, ?, ?)', [recipeId, title, image_url]);

  // Ajout au favoris
  await db.query('INSERT IGNORE INTO user_favorites (user_id, recipe_id) VALUES (?, ?)', [userId, recipeId]);

  res.json({ message: 'Recipe added to favorites' });
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    // Récupération des recettes favorites de l'utilisateur
    const [favorites] = await db.query(
      `SELECT r.id, r.title, r.image_url as image
       FROM recipes r
       JOIN user_favorites uf ON r.id = uf.recipe_id
       WHERE uf.user_id = ?`,
      [userId]
    );
    
    // Renvoyer directement le tableau de favoris
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { recipeId } = req.params;
    
    // Suppression du favori
    await db.query(
      'DELETE FROM user_favorites WHERE user_id = ? AND recipe_id = ?',
      [userId, recipeId]
    );
    
    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Error removing favorite' });
  }
};

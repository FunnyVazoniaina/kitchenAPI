import { Request, Response } from 'express';
import { getRecipesFromSpoonacular, getRecipesWithDetails } from '../services/spoonacular.service';
import { db } from '../config/db';

export const suggestRecipes = async (req: Request, res: Response) => {
  const ingredients = req.query.ingredients as string;
  const recipes = await getRecipesFromSpoonacular(ingredients);
  const userId = (req as any).user?.id;

  if (userId) {
    await db.query('INSERT INTO search_history (user_id, ingredients) VALUES (?, ?)', [userId, ingredients]);
  }

  res.json(recipes);
};

export const suggestRecipesWithDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const ingredients = req.query.ingredients as string;
    
    if (!ingredients) {
      res.status(400).json({ message: 'Ingredients parameter is required' });
      return;
    }
    
    const recipes = await getRecipesWithDetails(ingredients);
    const userId = (req as any).user?.id;

    if (userId) {
      await db.query('INSERT INTO search_history (user_id, ingredients) VALUES (?, ?)', [userId, ingredients]);
    }

    res.json(recipes);
  } catch (error) {
    console.error('Error suggesting recipes with details:', error);
    res.status(500).json({ message: 'Error suggesting recipes with details' });
  }
};

export const getSearchHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    
    // Récupération de l'historique de recherche de l'utilisateur
    const [history] = await db.query(
      `SELECT id, ingredients, searched_at 
       FROM search_history 
       WHERE user_id = ? 
       ORDER BY searched_at DESC`,
      [userId]
    );
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ message: 'Error fetching search history' });
  }
};

export const deleteSearchHistoryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const historyId = req.params.id;
    
    const [result] = await db.query(
      'DELETE FROM search_history WHERE id = ? AND user_id = ?',
      [historyId, userId]
    );
    
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: 'History item not found or not authorized' });
      return;
    }
    
    res.json({ message: 'Search history item deleted successfully' });
  } catch (error) {
    console.error('Error deleting search history item:', error);
    res.status(500).json({ message: 'Error deleting search history item' });
  }
};

export const clearSearchHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    
    await db.query(
      'DELETE FROM search_history WHERE user_id = ?',
      [userId]
    );
    
    res.json({ message: 'Search history cleared successfully' });
  } catch (error) {
    console.error('Error clearing search history:', error);
    res.status(500).json({ message: 'Error clearing search history' });
  }
};

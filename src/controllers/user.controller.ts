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

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    
    // Récupération des informations de l'utilisateur
    const [users] = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (!users || (users as any[]).length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    const user = (users as any[])[0];
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { name, email } = req.body;
    
    // Vérification des données requises
    if (!name && !email) {
      res.status(400).json({ message: 'At least one field (name or email) is required' });
      return;
    }
    
    // Construction de la requête dynamique
    let query = 'UPDATE users SET ';
    const params = [];
    const updates = [];
    
    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    
    if (email) {
      updates.push('email = ?');
      params.push(email);
    }
    
    query += updates.join(', ');
    query += ' WHERE id = ?';
    params.push(userId);
    
    // Mise à jour des informations de l'utilisateur
    const [result] = await db.query(query, params);
    
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: 'User not found or no changes made' });
      return;
    }
    
    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
};



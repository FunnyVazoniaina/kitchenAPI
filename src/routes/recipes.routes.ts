import express from 'express';
import { 
  suggestRecipes, 
  suggestRecipesWithDetails,
  getSearchHistory, 
  deleteSearchHistoryItem, 
  clearSearchHistory 
} from '../controllers/recipes.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Routes pour suggérer des recettes
router.get('/suggest', authenticateToken, suggestRecipes);
router.get('/suggest-with-details', authenticateToken, suggestRecipesWithDetails);

// Routes pour l'historique de recherche
router.get('/history', authenticateToken, getSearchHistory);
router.delete('/history/:id', authenticateToken, deleteSearchHistoryItem);
router.delete('/history', authenticateToken, clearSearchHistory);

export default router;

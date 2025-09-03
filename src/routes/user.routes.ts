import express from 'express';
import { 
  addFavorite, 
  getFavorites, 
  removeFavorite, 
  getUserProfile, 
  updateUserProfile,
  changePassword
} from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Routes pour les favoris
router.post('/favorites', authenticateToken, addFavorite);
router.get('/favorites', authenticateToken, getFavorites);
router.delete('/favorites/:recipeId', authenticateToken, removeFavorite);

// Routes pour le profil utilisateur
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.put('/change-password', authenticateToken, changePassword);

export default router;

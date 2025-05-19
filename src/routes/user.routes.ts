import express from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/favorites', authenticateToken, addFavorite);
router.get('/favorites', authenticateToken, getFavorites);
router.delete('/favorites/:recipeId', authenticateToken, removeFavorite);

export default router;

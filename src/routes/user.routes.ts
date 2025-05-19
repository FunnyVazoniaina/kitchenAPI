import express from 'express';
import { addFavorite } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/favorites', authenticateToken, addFavorite);

export default router;

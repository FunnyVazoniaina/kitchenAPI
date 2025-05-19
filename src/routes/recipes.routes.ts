import express from 'express';
import { suggestRecipes } from '../controllers/recipes.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/suggest', authenticateToken, suggestRecipes);

export default router;

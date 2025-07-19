import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import recipeRoutes from './routes/recipes.routes';
import userRoutes from './routes/user.routes';
import { Request, Response } from 'express';
import { connectToDatabase } from './config/db';
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true                
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Food Suggester API');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connectToDatabase()


export default app;

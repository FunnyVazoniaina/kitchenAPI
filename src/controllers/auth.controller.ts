import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import cloudinary from '../config/cloudinary';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;
  const file = req.file;

  let avatarUrl: string | null = null;

  if (file) {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'avatars' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
      avatarUrl = result.secure_url;
    } catch (err) {
      res.status(500).json({ message: 'Avatar upload failed' });
      return;
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.query(
      'INSERT INTO users (email, password_hash, name, avatar) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, avatarUrl]
    );
    res.status(201).json({ message: 'User created', avatar: avatarUrl });
  } catch {
    res.status(400).json({ message: 'User already exists' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const [rows]: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  res.json({ token, avatar: user.avatar });
};

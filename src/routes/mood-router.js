import express from 'express';
import { authenticateToken } from '../middlewares/authentication.js';
import { saveMood, getMoods } from '../controllers/mood-controller.js';

const moodRouter = express.Router();

moodRouter
  .route('/')
  .post(authenticateToken, saveMood)
  .get(authenticateToken, getMoods);

export default moodRouter;
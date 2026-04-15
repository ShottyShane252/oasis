import express from 'express';
import {body} from 'express-validator';
import {
  deleteEntry,
  getEntries,
  getEntryById,
  postEntry,
} from '../controllers/entry-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';
import {validationErrorHandler} from '../middlewares/error-handlers.js';

const entryRouter = express.Router();

entryRouter.route('/').get(authenticateToken, getEntries).post(
  authenticateToken,

  body('entry_date')
    .notEmpty()
    .withMessage('Entry date is required')
    .isISO8601()
    .withMessage('Entry date must be a valid date'),

  body('mood')
    .optional()
    .isIn(['great', 'good', 'okay', 'bad'])
    .withMessage('Mood must be great, good, okay, or bad'),

  body('weight')
    .optional({nullable: true})
    .isFloat({ min: 1 })
    .withMessage('Weight must be a positive number'),

  body('sleep_hours')
  .optional()
  .isInt({ min: 0, max: 24 })
  .withMessage('Sleep hours must be an integer between 0 and 24'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes can be max 500 characters'),

  validationErrorHandler,
  postEntry,
);

entryRouter
  .route('/:id')
  .get(authenticateToken, getEntryById)
  .delete(authenticateToken, deleteEntry);

export default entryRouter;

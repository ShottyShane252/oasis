import express from 'express';
import {body} from 'express-validator';
import {
  getLatestPsqi,
  getPsqiResults,
  postPsqiResult,
} from '../controllers/psqi-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';
import {validationErrorHandler} from '../middlewares/error-handlers.js';

const psqiRouter = express.Router();

psqiRouter
  .route('/')
  .get(authenticateToken, getPsqiResults)
  .post(
    authenticateToken,

    body('score')
      .notEmpty()
      .withMessage('PSQI score is required')
      .isInt({min: 0, max: 21})
      .withMessage('PSQI score must be an integer between 0 and 21'),

    body('interpretation')
      .optional()
      .trim()
      .isLength({max: 100})
      .withMessage('Interpretation can be max 100 characters'),

    body('component1').optional().isInt({min: 0, max: 3}),
    body('component2').optional().isInt({min: 0, max: 3}),
    body('component3').optional().isInt({min: 0, max: 3}),
    body('component4').optional().isInt({min: 0, max: 3}),
    body('component5').optional().isInt({min: 0, max: 3}),
    body('component6').optional().isInt({min: 0, max: 3}),
    body('component7').optional().isInt({min: 0, max: 3}),

    validationErrorHandler,
    postPsqiResult,
  );

psqiRouter.get('/latest', authenticateToken, getLatestPsqi);

export default psqiRouter;

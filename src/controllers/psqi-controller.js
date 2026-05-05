import {
  addPsqiResult,
  getLatestPsqiResultByUserId,
  getPsqiResultsByUserId,
} from '../models/psqi-model.js';


// GET kaikki käyttäjän PSQI tulokset
const getPsqiResults = async (req, res, next) => {
  try {
    const userId = req.user.user_id ?? req.user.userId;

    const result = await getPsqiResultsByUserId(userId);

    if (!result.error) {
      res.json(result);
    } else {
      const error = new Error(result.error);
      error.status = 500;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};


// GET viimeisin PSQI tulos
const getLatestPsqi = async (req, res, next) => {
  try {
    const userId = req.user.user_id ?? req.user.userId;

    const result = await getLatestPsqiResultByUserId(userId);

    if (!result?.error) {
      res.json(result);
    } else {
      const error = new Error(result.error || 'No PSQI result found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};


// POST uusi PSQI tulos
const postPsqiResult = async (req, res, next) => {
  try {
    const user_id = req.user.user_id ?? req.user.userId;

    const result = await addPsqiResult({
      user_id,
      ...req.body,
    });

    if (result.psqi_id) {
      res.status(201).json({
        message: 'PSQI result saved',
        ...result,
      });
    } else {
      const error = new Error('Failed to save PSQI result');
      error.status = 500;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};


export { getPsqiResults, getLatestPsqi, postPsqiResult };

import promisePool from '../utils/database.js';

const addPsqiResult = async (psqiResult) => {
  const {
    user_id,
    score,
    interpretation,
    component1,
    component2,
    component3,
    component4,
    component5,
    component6,
    component7,
  } = psqiResult;

  const sql = `INSERT INTO PsqiResults
    (user_id, score, interpretation, component1, component2, component3, component4, component5, component6, component7)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    user_id,
    score,
    interpretation,
    component1,
    component2,
    component3,
    component4,
    component5,
    component6,
    component7,
  ];

  try {
    const [result] = await promisePool.execute(sql, params);
    return {psqi_id: result.insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const getLatestPsqiResultByUserId = async (userId) => {
  const sql = `
    SELECT * FROM PsqiResults
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 1`;

  try {
    const [rows] = await promisePool.execute(sql, [userId]);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const getPsqiResultsByUserId = async (userId) => {
  const sql = `
    SELECT * FROM PsqiResults
    WHERE user_id = ?
    ORDER BY created_at DESC`;

  try {
    const [rows] = await promisePool.execute(sql, [userId]);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

export {addPsqiResult, getLatestPsqiResultByUserId, getPsqiResultsByUserId};

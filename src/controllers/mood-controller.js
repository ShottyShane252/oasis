import promisePool from '../utils/database.js';

export const saveMood = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { mood, mood_value, date } = req.body;
    
    const [existing] = await promisePool.execute(
      'SELECT id FROM moods WHERE user_id = ? AND date = ?',
      [user_id, date]
    );
    
    if (existing.length > 0) {
      await promisePool.execute(
        'UPDATE moods SET mood = ?, mood_value = ? WHERE user_id = ? AND date = ?',
        [mood, mood_value, user_id, date]
      );
      res.json({ message: 'Mood updated', date, mood });
    } else {
      await promisePool.execute(
        'INSERT INTO moods (user_id, mood, mood_value, date) VALUES (?, ?, ?, ?)',
        [user_id, mood, mood_value, date]
      );
      res.status(201).json({ message: 'Mood saved', date, mood });
    }
  } catch (error) {
    console.error('Save mood error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getMoods = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const limit = req.query.limit || 30;
    
    const [rows] = await promisePool.execute(
      'SELECT id, mood, mood_value, date FROM moods WHERE user_id = ? ORDER BY date DESC LIMIT ?',
      [user_id, parseInt(limit)]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ error: error.message });
  }
};


/*
Tekoälyä on käytetty tämän koodin ideoinnin ja muokkaamisen apuna.
*/
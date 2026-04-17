import {
  //listAllEntries,
  findEntryById,
  addEntry,
  listAllEntriesByUserId,
  removeEntryById,
} from '../models/entry-model.js';

const getEntries = async (req, res, next) => {
  // haetaan kaikkien käyttäjien merkinnät
  //const result = await listAllEntries();
  // haetaan kirjautuneen (token) käyttäjän omat merkinnät
  try {
    const result = await listAllEntriesByUserId(req.user.user_id ?? req.user.userId); 

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

const getEntryById = async (req, res, next) => {
  try {
    const entry = await findEntryById(req.params.id);
    if (entry) {
      res.json(entry);
    } else {
      const error = new Error('Entry not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const postEntry = async (req, res, next) => {
  try {
    const user_id = req.user.user_id ?? req.user.userId;

    const result = await addEntry({ user_id, ...req.body });

    if (result.entry_id) {
      res.status(201).json({
        message: 'New entry added.',
        ...result,
      });
    } else {
      const error = new Error('Failed to create entry');
      error.status = 500;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const putEntry = (req, res) => {
  // placeholder for future implementation
  res.sendStatus(200);
};

const deleteEntry = async (req, res, next) => {
  try {
    const affectedRows = await removeEntryById(
      req.params.id,
      req.user.user_id ?? req.user.userId
    );

    if (affectedRows > 0) {
      res.json({ message: 'entry deleted' });
    } else {
      const error = new Error('Entry not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export {getEntries, getEntryById, postEntry, putEntry, deleteEntry};

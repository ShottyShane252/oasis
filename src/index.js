import express from 'express';
import cors from 'cors';
import itemRouter from './routes/item-router.js';
import userRouter from './routes/user-router.js';
import requestLogger from './middlewares/logger.js';
import entryRouter from './routes/entry-router.js';
import {errorHandler, notFoundHandler} from './middlewares/error-handlers.js';
import kubiosRouter from './routes/kubios-router.js';
import moodRouter from './routes/mood-router.js';  // LISÄTTY
import psqiRouter from './routes/psqi-router.js'; // LISÄTTY


const hostname = '127.0.0.1';
const app = express();
const port = 3000;

// enable CORS requests
app.use(cors());

// parsitaan json data pyynnöstä ja lisätään request-objektiin
app.use(express.json());
// tarjoillaan webbisivusto (front-end) palvelimen juuressa
app.use('/', express.static('frontend'));
// Oma loggeri middleware, käytössä koko sovelluksen laajuisesti eli käsittee kaikki http-pyynnöt
app.use(requestLogger);

// API root
app.get('/api', (req, res) => {
  res.send('Teacher example Health Diary API!');
});

// Users resource router for all /api/users routes
app.use('/api/users', userRouter);
// Diary entries resource router
app.use('/api/entries', entryRouter);
// PSQI resource router
app.use('/api/psqi', psqiRouter); // LISÄTTY
// Dummy items resource
app.use('/api/items', itemRouter);

//Kubios data router
app.use('/api/kubios', kubiosRouter);

// Moods router (miltä sinusta tuntuu) - LISÄTTY
app.use('/api/moods', moodRouter);


app.use(notFoundHandler);
// virheenkäsittelijälle ohjataa kaikki pyynnöt, jossa mukana on error objekti
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

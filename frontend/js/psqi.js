const psqiForm = document.querySelector('#psqiForm');
const psqiScoreElement = document.querySelector('#psqiScore');
const psqiInterpretationElement = document.querySelector('#psqiInterpretation');
const latestPsqiElement = document.querySelector('#latestPsqi');

const apiUrl = 'http://localhost:3000/api/psqi'; // LISÄTTY: PSQI backend endpoint

const getToken = () => localStorage.getItem('token'); // LISÄTTY: hakee kirjautumistokenin

const getAuthHeaders = () => ({ // LISÄTTY: tekee Authorization-headerit backendille
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const isLoggedIn = () => { // LISÄTTY: tarkistaa onko käyttäjä kirjautunut
  const token = getToken();
  return token && token !== 'undefined';
};

const getRadioValue = (name) => {
  return Number(document.querySelector(`input[name="${name}"]:checked`).value);
};

const getNumberValue = (id) => {
  return Number(document.querySelector(`#${id}`).value);
};

const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const calculateTimeInBed = (bedTime, wakeTime) => {
  let bedMinutes = timeToMinutes(bedTime);
  let wakeMinutes = timeToMinutes(wakeTime);

  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 24 * 60;
  }

  return (wakeMinutes - bedMinutes) / 60;
};

const scoreSleepLatencyMinutes = (minutes) => {
  if (minutes <= 15) return 0;
  if (minutes <= 30) return 1;
  if (minutes <= 60) return 2;
  return 3;
};

const scoreSleepLatencyComponent = (q2Score, q5aScore) => {
  const sum = q2Score + q5aScore;

  if (sum === 0) return 0;
  if (sum <= 2) return 1;
  if (sum <= 4) return 2;
  return 3;
};

const scoreSleepDuration = (hours) => {
  if (hours > 7) return 0;
  if (hours >= 6) return 1;
  if (hours >= 5) return 2;
  return 3;
};

const scoreSleepEfficiency = (sleepHours, timeInBed) => {
  const efficiency = (sleepHours / timeInBed) * 100;

  if (efficiency > 85) return 0;
  if (efficiency >= 75) return 1;
  if (efficiency >= 65) return 2;
  return 3;
};

const scoreDisturbances = (sum) => {
  if (sum === 0) return 0;
  if (sum <= 9) return 1;
  if (sum <= 18) return 2;
  return 3;
};

const scoreDaytimeDysfunction = (sum) => {
  if (sum === 0) return 0;
  if (sum <= 2) return 1;
  if (sum <= 4) return 2;
  return 3;
};

const getInterpretation = (score) => {
  if (score <= 5) {
    return 'Good sleep quality';
  }

  if (score <= 10) {
    return 'Moderate sleep problems';
  }

  return 'Poor sleep quality';
};

const savePsqiResultToBackend = async (psqiResult) => { // MUUTETTU: tallentaa backendin kautta tietokantaan
  if (!isLoggedIn()) { // LISÄTTY: jos ei ole kirjautunut, ei tallenneta
    return;
  }

  const response = await fetch(apiUrl, { // LISÄTTY: POST /api/psqi
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(psqiResult),
  });

  if (!response.ok) { // LISÄTTY: virhe backend-tallennuksessa
    console.error('PSQI result save failed');
  }
};

const loadLatestPsqiResult = async () => { // MUUTETTU: hakee viimeisimmän tuloksen backendistä
  if (!latestPsqiElement) return;

  if (!isLoggedIn()) { // MUUTETTU: kirjautumaton ei näe tallennettua tulosta
    latestPsqiElement.textContent = 'Log in to save your PSQI result.';
    return;
  }

  const response = await fetch(`${apiUrl}/latest`, { // LISÄTTY: GET /api/psqi/latest
    headers: getAuthHeaders(),
  });

  if (!response.ok) { // LISÄTTY: jos tulosta ei löydy tai haku epäonnistuu
    latestPsqiElement.textContent = 'No saved PSQI result yet.';
    return;
  }

  const result = await response.json(); // LISÄTTY: muunnetaan backend-vastaus JSONiksi

  if (!result || !result.score) { // LISÄTTY: varmistus tyhjälle vastaukselle
    latestPsqiElement.textContent = 'No saved PSQI result yet.';
    return;
  }

  const date = result.created_at ? result.created_at.split('T')[0] : 'No date'; // LISÄTTY: näytettävä päivämäärä

  latestPsqiElement.textContent = `Latest saved score: ${result.score} / 21 (${date}) - ${result.interpretation}`; // MUUTETTU: näyttää tietokannasta haetun tuloksen
};

const calculatePsqiScore = async (event) => { // MUUTETTU: async koska tallennetaan backendille
  event.preventDefault();

  const q1 = document.querySelector('#q1').value;
  const q2 = getNumberValue('q2');
  const q3 = document.querySelector('#q3').value;
  const q4 = getNumberValue('q4');

  const q5a = getRadioValue('q5a');
  const q5b = getRadioValue('q5b');
  const q5c = getRadioValue('q5c');
  const q5d = getRadioValue('q5d');
  const q5e = getRadioValue('q5e');
  const q5f = getRadioValue('q5f');
  const q5g = getRadioValue('q5g');
  const q5h = getRadioValue('q5h');
  const q5i = getRadioValue('q5i');
  const q5j = getRadioValue('q5j');

  const q6 = getRadioValue('q6');
  const q7 = getRadioValue('q7');
  const q8 = getRadioValue('q8');
  const q9 = getRadioValue('q9');

  const component1 = q6;

  const q2Score = scoreSleepLatencyMinutes(q2);
  const component2 = scoreSleepLatencyComponent(q2Score, q5a);

  const component3 = scoreSleepDuration(q4);

  const timeInBed = calculateTimeInBed(q1, q3);
  const component4 = scoreSleepEfficiency(q4, timeInBed);

  const disturbancesSum = q5b + q5c + q5d + q5e + q5f + q5g + q5h + q5i + q5j;
  const component5 = scoreDisturbances(disturbancesSum);

  const component6 = q7;

  const component7 = scoreDaytimeDysfunction(q8 + q9);

  const globalScore =
    component1 +
    component2 +
    component3 +
    component4 +
    component5 +
    component6 +
    component7;

  const interpretation = getInterpretation(globalScore);

  psqiScoreElement.textContent = globalScore;
  psqiInterpretationElement.textContent = `Your PSQI score is ${globalScore}. You have ${interpretation}.`;

  const psqiResult = { // LISÄTTY: data joka lähetetään backendille
    score: globalScore,
    interpretation: interpretation,
    component1: component1,
    component2: component2,
    component3: component3,
    component4: component4,
    component5: component5,
    component6: component6,
    component7: component7,
  };

  await savePsqiResultToBackend(psqiResult); // MUUTETTU: tallentaa tietokantaan jos käyttäjä on kirjautunut
  await loadLatestPsqiResult(); // MUUTETTU: päivittää yläosan uusimmalla tietokantatuloksella
};

psqiForm.addEventListener('submit', calculatePsqiScore);

document.addEventListener('DOMContentLoaded', loadLatestPsqiResult); // MUUTETTU: hakee viimeisimmän tuloksen backendistä

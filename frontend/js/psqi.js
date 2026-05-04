const psqiForm = document.querySelector('#psqiForm');
const psqiScoreElement = document.querySelector('#psqiScore');
const psqiInterpretationElement = document.querySelector('#psqiInterpretation');
const latestPsqiElement = document.querySelector('#latestPsqi'); // finds latest saved score display

const getLoggedInUserKey = () => { // creates user-specific localStorage key
  const token = localStorage.getItem('token'); //  checks if user is logged in
  const name = localStorage.getItem('name'); //gets logged in user's name

  if (!token || !name || name === 'undefined') { //if no valid login dont save
    return null;
  }

  return `psqiResult_${name}`; // each user gets their own saved PSQI result
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

const savePsqiResultForLoggedInUser = (score) => { //  saves only if user is logged in
  const userKey = getLoggedInUserKey(); // gets user-specific key

  if (!userKey) { // if not logged in do not save
    return;
  }

  const today = new Date().toISOString().split('T')[0]; // added: saves current date

  const psqiResult = { //object stored in localStorage
    score: score,
    date: today,
    interpretation: getInterpretation(score),
  };

  localStorage.setItem(userKey, JSON.stringify(psqiResult)); //  saves result for current user only
};

const loadLatestPsqiResult = () => { // loads saved score when page opens
  if (!latestPsqiElement) return; // prevents error

  const userKey = getLoggedInUserKey();

  if (!userKey) { // added: not logged in users do not get saved result
    latestPsqiElement.textContent = 'Log in to save your PSQI result.';
    return;
  }

  const savedResult = localStorage.getItem(userKey);

  if (!savedResult) {
    latestPsqiElement.textContent = 'No saved PSQI result yet.';
    return;
  }

  const result = JSON.parse(savedResult);

  latestPsqiElement.textContent = `Latest saved score: ${result.score} / 21 (${result.date}) - ${result.interpretation}`; // added: shows saved result
};

const calculatePsqiScore = (event) => {
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

  savePsqiResultForLoggedInUser(globalScore); // added: saves only for logged in user
  loadLatestPsqiResult(); // added: refreshes top latest result after calculation
};

psqiForm.addEventListener('submit', calculatePsqiScore);

document.addEventListener('DOMContentLoaded', loadLatestPsqiResult); // added: shows saved result when page loads

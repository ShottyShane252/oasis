import { fetchData } from './fetch.js';


const apiUrl = 'http://localhost:3000/api/entries';

const entriesList = document.querySelector('.entries-list');
const diaryForm = document.querySelector('#diaryForm');

const token = localStorage.getItem('token');

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
};

const renderEntries = (entries) => {
  entriesList.innerHTML = '';

  entries.forEach(entry => {

    const div = document.createElement('div');
    div.classList.add('entry-card');

    div.innerHTML = `
  <h4>${entry.entry_date}</h4>
  <p>Mood: ${entry.mood}</p>
  <p>Sleep: ${entry.sleep_hours} hours</p>
  <p>${entry.notes}</p>
  <button data-id="${entry.entry_id}" class="view-btn">View</button>
  <button data-id="${entry.entry_id}" class="delete-btn">Delete</button>
`;

    entriesList.appendChild(div);
  });
};

const getEntries = async () => {

  const options = {
    headers
  };

  const entries = await fetchData(apiUrl, options);

  if (entries.error) {
    console.error(entries.error);
    return;
  }

  renderEntries(entries);
};

const getEntryById = async (id) => {

  const options = {
    headers
  };

  const entry = await fetchData(`${apiUrl}/${id}`, options);

  if (entry.error) {
    console.error(entry.error);
    return;
  }

  alert(
    `Date: ${entry.entry_date}\nMood: ${entry.mood}\nSleep: ${entry.sleep_hours} hours\nNotes: ${entry.notes}`
  );
};

const addEntry = async (event) => {

  event.preventDefault();

  const entryDate = document.querySelector('#entryDate').value;
  const mood = document.querySelector('#mood').value;
  const sleep = document.querySelector('#sleep').value;
  const notes = document.querySelector('#notes').value;

  const body = {
    entry_date: entryDate,
    mood: mood,
    weight: null,
    sleep_hours: sleep ? Number(sleep) : null,
    notes: notes
  };

  console.log('Adding entry:', body);

  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  };

  const response = await fetchData(apiUrl, options);

  if (response.error) {
    console.error(response.error);
    return;
  }

  diaryForm.reset();

  getEntries();
};

const deleteEntry = async (id) => {

  const options = {
    method: 'DELETE',
    headers
  };

  await fetchData(`${apiUrl}/${id}`, options);

  getEntries();
};

document.addEventListener('click', (event) => {

  if (event.target.classList.contains('view-btn')) {

    const id = event.target.dataset.id;

    getEntryById(id);
  }

  if (event.target.classList.contains('delete-btn')) {

    const id = event.target.dataset.id;

    deleteEntry(id);
  }
});

diaryForm.addEventListener('submit', addEntry);

getEntries();

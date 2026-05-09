import { fetchData } from './fetch.js';


const apiUrl = 'http://daauudi.switzerlandnorth.cloudapp.azure.com/api/entries';

const entriesList = document.querySelector('.entries-list');
const diaryForm = document.querySelector('#diaryForm');
const diaryResponse = document.querySelector('#diaryResponse');

const token = localStorage.getItem('token');

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fi-FI');
};

const moodTranslations = {
  great: 'Erinomainen',
  good: 'Hyvä',
  okay: 'Neutraali',
  bad: 'Huono'
};

const renderEntries = (entries) => {
  entriesList.innerHTML = '';

  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.entry_date) - new Date(a.entry_date);
  });

  sortedEntries.forEach(entry => {

    const div = document.createElement('div');
    div.classList.add('entry-card');

    div.innerHTML = `
  <h4>${formatDate(entry.entry_date)}</h4>
  <p>Mieliala: ${moodTranslations[entry.mood] || entry.mood}</p>
  <p>Uni: ${entry.sleep_hours ?? '-'} tuntia</p>
  <p>Paino: ${entry.weight ?? '-'} kg</p>
  <p>${entry.notes || ''}</p>
  <button data-id="${entry.entry_id}" class="view-btn">Näytä</button>
  <button data-id="${entry.entry_id}" class="delete-btn">Poista</button>
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
    `Päivämäärä: ${formatDate(entry.entry_date)}\nMieliala: ${moodTranslations[entry.mood] || entry.mood}\nUni: ${entry.sleep_hours ?? '-'} tuntia\nPaino: ${entry.weight ?? '-'} kg\nMuistiinpanot: ${entry.notes || ''}`
  );
};

const addEntry = async (event) => {

  event.preventDefault();

  const entryDate = document.querySelector('#entryDate').value;
  const mood = document.querySelector('#mood').value;
  const sleep = document.querySelector('#sleep').value;
  const weight = document.querySelector('#weight').value;
  const notes = document.querySelector('#notes').value;

  const body = {
    entry_date: entryDate,
    mood: mood,
    weight: weight ? Number(weight) : null,
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

diaryResponse.textContent = 'Merkintä tallennettu onnistuneesti!';
diaryResponse.style.color = '#16a34a';

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

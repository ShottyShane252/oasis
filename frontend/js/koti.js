/*
Tekoälyä on käytetty tämän koodin ideoinnin ja muokkaamisen apuna.
*/


// koti.js
import { fetchKubiosData, parseKubiosData, drawReadinessGraph } from './kubios.js';

const API_URL = 'http://localhost:3000/api';
const getToken = () => localStorage.getItem('token');
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Fiilis kohat
const moodEmojis = {
  'erittain_huono': '😫',
  'huono': '😞',
  'neutraali': '😐',
  'hyva': '🙂',
  'erittain_hyva': '😄'
};

const moodValues = {
  'erittain_huono': 1,
  'huono': 2,
  'neutraali': 3,
  'hyva': 4,
  'erittain_hyva': 5
};

const moodTexts = {
  'erittain_huono': 'Erittäin huono',
  'huono': 'Huono',
  'neutraali': 'Neutraali',
  'hyva': 'Hyvä',
  'erittain_hyva': 'Erittäin hyvä'
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fi-FI');
};

// Mood funktiot
const saveMoodToBackend = async (mood, moodValue, date) => {
  try {
    const token = getToken();
    if (!token) return false;

    const response = await fetch(`${API_URL}/moods`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ mood, mood_value: moodValue, date })
    });
    return response.ok;
  } catch (error) {
    console.error('Save mood error:', error);
    return false;
  }
};

const fetchMoodsFromBackend = async () => {
  try {
    const token = getToken();
    if (!token) return [];
    const response = await fetch(`${API_URL}/moods`, { headers: getAuthHeaders() });
    if (response.ok) return await response.json();
    return [];
  } catch (error) {
    console.error('Fetch moods error:', error);
    return [];
  }
};

const saveMood = async (mood, moodValue) => {
  const today = new Date().toISOString().split('T')[0];
  const saved = await saveMoodToBackend(mood, moodValue, today);

  if (saved) {
    await displayMoodHistory();
    const messages = {
      'erittain_huono': "Toivottavasti huominen on parempi! 💙",
      'huono': "Toivottavasti saat levättyä ja olo helpottaa. 🌙",
      'neutraali': "Neutraali päivä on ihan ok. Pieni hetki itselle tekisi hyvää. 🌿",
      'hyva': "Hyvä fiilis on hyväksi terveydelle! 🙌",
      'erittain_hyva': "Mahtavaa! Jatka samaan malliin! 💪"
    };
    document.getElementById('moodMessage').innerHTML = messages[mood] || "Kiitos palautteesta!";
  }
};

const displayMoodHistory = async () => {
  const container = document.getElementById('moodHistory');
  let moods = await fetchMoodsFromBackend();

  if (moods.length === 0) {
    container.innerHTML = '<div style="text-align: center; color: #94a3b8;">Ei tallennettuja fiiliksiä</div>';
    return;
  }

  const latest = moods.slice(0, 10);
  container.innerHTML = latest.map(item => `
    <div class="koti-mood-history-item">
      <span>${formatDate(item.date)}</span>
      <span class="koti-mood-emoji-history">${moodEmojis[item.mood] || '😐'} ${moodTexts[item.mood] || item.mood}</span>
    </div>
  `).join('');
};

const checkTodayMood = async () => {
  const today = new Date().toISOString().split('T')[0];
  const moods = await fetchMoodsFromBackend();
  return moods.find(m => m.date === today);
};

const initMoodSelector = async () => {
  const buttons = document.querySelectorAll('.mood-emoji');
  await displayMoodHistory();

  const todaysMood = await checkTodayMood();
  if (todaysMood) {
    buttons.forEach(btn => {
      if (btn.dataset.mood === todaysMood.mood) btn.classList.add('selected');
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      buttons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const mood = btn.dataset.mood;
      const moodValue = moodValues[mood];
      await saveMood(mood, moodValue);
    });
  });
};

// PubMed funktiot
const PUBMED_API = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const PUBMED_SUMMARY = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';

const searchTerms = [
  'sleep university students',
  'HRV heart rate variability sleep students',
  'student sleep quality academic performance'
];

const tips = [
  { emoji: "🌅", text: "Mene nukkumaan ja herää samaan aikaan joka päivä – se parantaa unen laatua!" },
  { emoji: "💧", text: "Juo lasillinen vettä heti herättyäsi – saat aineenvaihdunnan käyntiin!" },
  { emoji: "🧘", text: "Pidä 5 minuutin hengityshetki keskellä päivää – se vähentää stressiä!" },
  { emoji: "📱", text: "Älä katso ruutua tuntiin ennen nukkumaanmenoa – uni tulee paremmin!" },
  { emoji: "🌙", text: "Vältä kofeiinia 6 tuntia ennen nukkumaanmenoa – se parantaa unenlaatua!" }
];

let currentTip = null;

const setDailyTip = () => {
  if (!currentTip) currentTip = tips[Math.floor(Math.random() * tips.length)];
  document.getElementById('dailyTip').innerHTML = `${currentTip.emoji} ${currentTip.text}`;
};

const fetchResearchArticle = async () => {
  try {
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const searchUrl = `${PUBMED_API}?db=pubmed&term=${encodeURIComponent(randomTerm)}&retmax=30&sort=relevance&retmode=json`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData?.esearchresult?.idlist?.length > 0) {
      const idList = searchData.esearchresult.idlist;
      const randomIndex = Math.floor(Math.random() * Math.min(idList.length, 15));
      const articleId = idList[randomIndex];
      const summaryUrl = `${PUBMED_SUMMARY}?db=pubmed&id=${articleId}&retmode=json`;
      const summaryResponse = await fetch(summaryUrl);
      const summaryData = await summaryResponse.json();

      if (summaryData?.result?.[articleId]) {
        const article = summaryData.result[articleId];
        let abstract = article.abstract || `Tutkimus liittyy aiheeseen: ${randomTerm}.`;
        let shortAbstract = abstract.length > 1500 ? abstract.substring(0, 1500) + '...' : abstract;
        return {
          title: article.title || 'Untitled Research',
          abstract: shortAbstract,
          source: `PubMed • ${article.source || 'Research Article'}`,
          link: `https://pubmed.ncbi.nlm.nih.gov/${articleId}/`
        };
      }
    }
    return null;
  } catch (error) {
    console.error('PubMed API error:', error);
    return null;
  }
};

const setDailyArticle = async () => {
  const articleTitleElem = document.getElementById('articleTitle');
  const articleContentElem = document.getElementById('articleContent');
  const articleMetaElem = document.getElementById('articleMeta');
  const articleSourceElem = document.getElementById('articleSource');

  articleContentElem.innerHTML = '<div class="koti-article-loading">🔍 Haetaan tuoreita tutkimuksia...</div>';
  const article = await fetchResearchArticle();

  if (!article) {
    articleContentElem.innerHTML = '<div class="koti-article-error">⚠️ Tutkimusten haku epäonnistui.</div>';
    articleTitleElem.innerHTML = '📖 Tutkimuksia ei voitu hakea';
    articleSourceElem.innerHTML = '';
    return;
  }

  articleTitleElem.innerHTML = `📖 <a href="${article.link}" target="_blank">${article.title}</a>`;
  articleContentElem.innerHTML = `<div class="koti-article-text">${article.abstract}</div>`;
  articleSourceElem.innerHTML = article.source;

  if (!articleMetaElem.querySelector('.koti-read-more')) {
    const readMoreLink = document.createElement('a');
    readMoreLink.href = article.link;
    readMoreLink.target = '_blank';
    readMoreLink.className = 'koti-read-more';
    readMoreLink.textContent = 'Lue koko tutkimus →';
    articleMetaElem.appendChild(readMoreLink);
  }
};

// Pääfunktio
const init = async () => {
  let username = localStorage.getItem('name') || localStorage.getItem('username');
  if (username && username !== 'undefined' && username !== 'null') {
    document.getElementById('greetingName').textContent = username;
  }

  setDailyTip();
  await setDailyArticle();

  const token = getToken();
  if (!token) {
    drawReadinessGraph(null);
    initMoodSelector();
    return;
  }

  const kubiosData = await fetchKubiosData();
  const parsedData = parseKubiosData(kubiosData);
  drawReadinessGraph(parsedData.length > 0 ? parsedData : null);
  initMoodSelector();
};

init();




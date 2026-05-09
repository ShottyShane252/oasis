/*
Tekoälyä on käytetty tämän koodin ideoinnin ja muokkaamisen apuna.
*/

let hrvChart = null;
let readinessChart = null;
let hrChart = null;

const API_URL = 'https://daauudi.switzerlandnorth.cloudapp.azure.com/api';

const getToken = () => localStorage.getItem('token');

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

async function fetchKubiosData() {
  try {
    const token = getToken();
    if (!token) {
      console.warn('Ei kirjautumistokenia');
      return null;
    }

    const response = await fetch(`${API_URL}/kubios/user-data`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Kirjautuminen vanhentunut tai ei oikeuksia');
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Kubios data haettu:', data);
    return data;
  } catch (error) {
    console.error('Kubios datan haku epäonnistui:', error);
    return null;
  }
}

//  Kubios data
function parseKubiosData(kubiosData) {
  console.log('Parsitaan dataa');

  if (!kubiosData) return [];

  let results = [];
  if (kubiosData.results && Array.isArray(kubiosData.results)) {
    results = kubiosData.results;
  } else if (Array.isArray(kubiosData)) {
    results = kubiosData;
  } else {
    return [];
  }

  if (results.length === 0) return [];

  const parsed = [];

  for (let i = 0; i < results.length; i++) {
    const item = results[i];

    let date = '';
    if (item.measured_timestamp) {
      date = item.measured_timestamp.split('T')[0];
    } else if (item.create_timestamp) {
      date = item.create_timestamp.split('T')[0];
    }

    const resultData = item.result || {};

    // HRV (RMSSD)
    let rmssd = 0;
    if (resultData.rmssd_ms !== undefined && resultData.rmssd_ms !== null) {
      rmssd = parseFloat(resultData.rmssd_ms.toFixed(1));
    }

    // Readiness
    let readiness = 0;
    if (resultData.readiness !== undefined && resultData.readiness !== null) {
      readiness = Math.round(resultData.readiness / 10);
      if (readiness < 1) readiness = 1;
      if (readiness > 10) readiness = 10;
    }

    // SYKE (Heart Rate)
    let heartRate = 0;
    if (resultData.mean_hr_bpm !== undefined && resultData.mean_hr_bpm !== null) {
      heartRate = Math.round(resultData.mean_hr_bpm);
    }

    // Stress Index
    let stressIndex = 0;
    if (resultData.stress_index !== undefined && resultData.stress_index !== null) {
      stressIndex = parseFloat(resultData.stress_index.toFixed(1));
    }

    // Recovery (palautuminen)
    let recovery = 0;
    if (resultData.recovery !== undefined && resultData.recovery !== null) {
      recovery = Math.round(resultData.recovery);
    }

    // PNS Index (parasympaattinen)
    let pnsIndex = 0;
    if (resultData.pns_index !== undefined && resultData.pns_index !== null) {
      pnsIndex = parseFloat(resultData.pns_index.toFixed(1));
    }

    // SNS Index (sympaattinen)
    let snsIndex = 0;
    if (resultData.sns_index !== undefined && resultData.sns_index !== null) {
      snsIndex = parseFloat(resultData.sns_index.toFixed(1));
    }

    parsed.push({
      date: date,
      rmssd: rmssd,
      readiness: readiness,
      heartRate: heartRate,
      stressIndex: stressIndex,
      recovery: recovery,
      pnsIndex: pnsIndex,
      snsIndex: snsIndex
    });
  }

  console.log(`Parsittu ${parsed.length} mittausta`);
  return parsed;
}

// HRV diagrammi
function createHrvChart(data) {
  const canvas = document.getElementById("hrvChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (hrvChart) hrvChart.destroy();

  if (!data || data.length === 0) {
    hrvChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Ei dataa"],
        datasets: [{
          label: "RMSSD (ms)",
          data: [0],
          backgroundColor: "rgba(156, 163, 175, 0.5)"
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
    return;
  }

  const dates = data.map(item => item.date?.slice(0, 10) || "Ei päivää");
  const rmssdValues = data.map(item => item.rmssd || 0);

  hrvChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dates,
      datasets: [{
        label: "RMSSD (ms)",
        data: rmssdValues,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: { callbacks: { label: (ctx) => `RMSSD: ${ctx.raw} ms` } }
      },
      scales: {
        y: { title: { display: true, text: "RMSSD (ms)" }, beginAtZero: true },
        x: { title: { display: true, text: "Päivämäärä" }, ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 8 } }
      }
    }
  });
}

//  syke diagrammi
function createHeartRateChart(data) {
  const canvas = document.getElementById("heartRateChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (hrChart) hrChart.destroy();

  if (!data || data.length === 0) {
    hrChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Ei dataa"],
        datasets: [{ label: "Syke (bpm)", data: [0], borderColor: "rgba(239, 68, 68, 0.7)", backgroundColor: "rgba(239, 68, 68, 0.1)", fill: true }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
    return;
  }

  const dates = data.map(item => item.date?.slice(0, 10) || "Ei päivää");
  const hrValues = data.map(item => item.heartRate || 0);

  hrChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "Syke (bpm)",
        data: hrValues,
        borderColor: "rgba(239, 68, 68, 0.7)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "rgba(239, 68, 68, 1)"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: { callbacks: { label: (ctx) => `Syke: ${ctx.raw} bpm` } }
      },
      scales: {
        y: { title: { display: true, text: "Syke (bpm)" }, beginAtZero: true },
        x: { title: { display: true, text: "Päivämäärä" }, ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 8 } }
      }
    }
  });
}

// readiness ympyrädiagrammi
function createReadinessChart(data) {
  const canvas = document.getElementById("readinessChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (readinessChart) readinessChart.destroy();

  if (!data || data.length === 0) {
    readinessChart = new Chart(ctx, {
      type: "doughnut",
      data: { labels: ["Ei dataa"], datasets: [{ data: [1], backgroundColor: ["rgba(156, 163, 175, 0.5)"] }] },
      options: { responsive: true, maintainAspectRatio: false }
    });
    return;
  }

  const readinessCounts = {
    "Matala (1-3)": 0,
    "Keskitaso (4-7)": 0,
    "Korkea (8-10)": 0
  };

  data.forEach(item => {
    const r = item.readiness || 0;
    if (r <= 3) readinessCounts["Matala (1-3)"]++;
    else if (r <= 7) readinessCounts["Keskitaso (4-7)"]++;
    else if (r <= 10) readinessCounts["Korkea (8-10)"]++;
  });

  const labels = Object.keys(readinessCounts);
  const values = Object.values(readinessCounts);
  const colors = ["rgba(239, 68, 68, 0.7)", "rgba(245, 158, 11, 0.7)", "rgba(16, 185, 129, 0.7)"];

  const filteredLabels = [];
  const filteredValues = [];
  const filteredColors = [];

  for (let i = 0; i < labels.length; i++) {
    if (values[i] > 0) {
      filteredLabels.push(labels[i]);
      filteredValues.push(values[i]);
      filteredColors.push(colors[i]);
    }
  }

  if (filteredValues.length === 0) {
    filteredLabels.push("Ei dataa");
    filteredValues.push(1);
    filteredColors.push("rgba(156, 163, 175, 0.5)");
  }

  readinessChart = new Chart(ctx, {
    type: "doughnut",
    data: { labels: filteredLabels, datasets: [{ data: filteredValues, backgroundColor: filteredColors, borderWidth: 0, hoverOffset: 10 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const total = filteredValues.reduce((a, b) => a + b, 0);
              const percentage = ((ctx.raw / total) * 100).toFixed(1);
              return `${ctx.label}: ${ctx.raw} mittausta (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// päivittää taulukko
function updateDataTable(data) {
  const tbody = document.getElementById("tableBody");
  if (!tbody) return;

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="no-data">Ei dataa. Kirjaudu sisään Kubios-tunnuksilla.<table></tr>`;
    return;
  }

  let html = "";
  const sortedData = [...data].reverse();

  sortedData.forEach(item => {
    html += `
      <tr>
        <td>${item.date || "Ei päivää"}</td>
        <td>${item.rmssd || "-"} ms</td>
        <td>${item.readiness || "-"}/10</td>
        <td>${item.heartRate || "-"} bpm</td>
        <td>${item.stressIndex || "-"}</td>
        <td>${item.recovery ? item.recovery + "/100" : "-"}</td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

async function loadAndDisplayData() {
  const token = getToken();
  if (!token) {
    showLoginMessage();
    return;
  }

  const kubiosData = await fetchKubiosData();
  if (!kubiosData) {
    showErrorMessage("Ei voitu hakea Kubios-dataa.");
    return;
  }

  const parsedData = parseKubiosData(kubiosData);
  if (parsedData.length === 0) {
    showErrorMessage("Ei mittausdataa.");
    return;
  }

  createHrvChart(parsedData);
  createHeartRateChart(parsedData);
  createReadinessChart(parsedData);
  updateDataTable(parsedData);
  hideMessage();
}

function showLoginMessage() {
  const container = document.querySelector('.kubios-graphs');
  if (container) {
    let msgDiv = document.getElementById('kubios-message');
    if (!msgDiv) {
      msgDiv = document.createElement('div');
      msgDiv.id = 'kubios-message';
      msgDiv.style.cssText = `text-align: center; padding: 3rem; background: white; border-radius: 24px; margin: 2rem 0; border: 1px solid #cbd5e1;`;
      container.parentNode.insertBefore(msgDiv, container);
    }
    msgDiv.innerHTML = `
      <h3 style="color: #3b82f6;">🔐 Kirjaudu sisään</h3>
      <p>Kirjaudu sisään Kubios-tunnuksillasi nähdäksesi mittauksesi.</p>
      <a href="login.html" class="kubios-btn" style="display: inline-block; background: #3b82f6; color: white; padding: 0.5rem 1.5rem; border-radius: 2rem; text-decoration: none;">Kirjaudu</a>
    `;
  }
}

function showErrorMessage(message) {
  const container = document.querySelector('.kubios-graphs');
  if (container) {
    let msgDiv = document.getElementById('kubios-message');
    if (!msgDiv) {
      msgDiv = document.createElement('div');
      msgDiv.id = 'kubios-message';
      msgDiv.style.cssText = `text-align: center; padding: 2rem; background: #fee2e2; border-radius: 16px; margin: 2rem 0; border: 1px solid #fecaca; color: #b91c1c;`;
      container.parentNode.insertBefore(msgDiv, container);
    }
    msgDiv.innerHTML = `<p>⚠️ ${message}</p>`;
  }
}

function hideMessage() {
  const msgDiv = document.getElementById('kubios-message');
  if (msgDiv) msgDiv.remove();
}


// Readiness graafi (vain readiness - kotisivua varten)
function drawReadinessGraph(data, canvasId = 'readinessGraph') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Tuhotaan vanha chart jos on olemassa
  if (readinessChart) {
    readinessChart.destroy();
  }

  if (!data || data.length === 0) {
    const demoLabels = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
    const demoValues = [6, 7, 5, 8, 9, 7, 6];
    readinessChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: demoLabels,
        datasets: [{
          label: 'Readiness (1-10)',
          data: demoValues,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 10, title: { display: true, text: 'Readiness' } } }
      }
    });
    return;
  }

  const dates = data.map(item => item.date?.slice(5) || '?');
  const values = data.map(item => item.readiness || 0);

  readinessChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Readiness (1-10)',
        data: values,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 0, max: 10, title: { display: true, text: 'Readiness (1-10)' }, ticks: { stepSize: 1 } },
        x: { title: { display: true, text: 'Päivämäärä' } }
      },
      plugins: {
        tooltip: { callbacks: { label: (ctx) => `Readiness: ${ctx.raw}/10` } }
      }
    }
  });
}

// Exportit kotisivua varten (lisätty, ei poistettu mitään)
export { fetchKubiosData, parseKubiosData, drawReadinessGraph };

document.addEventListener("DOMContentLoaded", () => {
  loadAndDisplayData();
});


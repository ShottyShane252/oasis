import { fetchData } from '../js/fetch.js';

// 1. hae data
// 2. muotoile data
// 3. anna muotoiltu data graafikirjastolle

// Function to test and get user info from kubios API
const getUserInfo = async () => {
  console.log('Käyttäjän INFO Kubioksesta');

  const url = 'http://daauudi.switzerlandnorth.cloudapp.azure.com/api/kubios/user-info';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const userData = await fetchData(url, options);

  if (userData.error) {
    console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
    return;
  }
  console.log(userData);
};

// Function to get more actual data from Kubios API
const getUserData = async () => {
  console.log('Käyttäjän DATA Kubioksesta');

  const url = 'http://daauudi.switzerlandnorth.cloudapp.azure.com/api/kubios/user-data';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const userData = await fetchData(url, options);

  if (userData.error) {
    console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
    return;
  }

  // Draw chart with chart.js
  drawChart(userData);
  let formattedData = formatKubiosResults(userData);
  console.log('Formatted Data', formattedData);
  // Draw chart with amcharts
  drawAMChart(formattedData);
};

// You need to formulate data into correct structure in the BE
// OR you can extract the data here in FE from one or multiple sources
// Extract data: https://www.w3schools.com/jsref/jsref_map.asp

const formatKubiosResults = (userData) => {
  // Formatter chat.js varten
  const formatter = new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'long',
  });

  const formattedData = userData.results.map((entry) => {
    // Muunnetaan päivämäärä Date-olioksi
    const dateObject = new Date(entry.daily_result);
    // Muotoillaan label (esim "19. elokuuta") chart.js varten
    const formattedLabel = formatter.format(dateObject);
    // Timestamp amCharts varten, muuttaa päivämäärän numeroksi
    const timestamp = dateObject.getTime();

    // palautetaan muotoiltu objekti jossa oikeat arvot
    return {
      date: entry.daily_result, // alkuperäine päivämäätä
      timestamp: timestamp, // amcharts
      label: formattedLabel,
      readiness: entry.result.readiness,
      stressIndex: entry.result.stress_index,
      snsIndex: entry.result.sns_index,
    };


  });

  return formattedData;
};

// Let us try these together
const drawChart = (userData) => {
  // Create the chart
  // https://www.chartjs.org/docs/latest/charts/line.html
  // https://www.chartjs.org/docs/latest/samples/line/line.html

  console.log(userData);

  // .map kertaus
  const numerot = [1, 2, 3];
  const tuplattu = numerot.map((alkio) => {
    return alkio * 2;
  });

  console.log(numerot, tuplattu);

  // Muodostetaan erilliset taulukot chat.js:sää varten
  // haetaan käyttämällä map metodia vain kaikki readiness arvot
  const readiness = userData.results.map((rivi) => rivi.result.readiness);

  //
  const formatter = new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'long',
  });

  // Hakekaan otsikoksi päivämäärä
  // const labels = userData.results.map((rivi) => rivi.daily_result);
  const labels = userData.results.map((rivi) =>
    formatter.format(new Date(rivi.daily_result))
  );
  // Hakekaa stressIndex tiedot
  const stressIndex = userData.results.map((rivi) => rivi.result.stress_index);

    // Hakekaa SNSindex tiedot
  const snsIndex = userData.results.map((rivi) => rivi.result.sns_index);

  console.log('Labels', labels);
  console.log('Readiness', readiness);
  console.log('Stress Index', stressIndex);
  console.log('SNS Index', snsIndex);
  const ctx = document.getElementById('jsChart');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Readiness',
          data: readiness,
          borderWidth: 1,
          borderColor: 'red',
        },
        {
          label: 'Stress Index',
          data: stressIndex,
          borderWidth: 1,
          borderColor: 'blue',
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Readiness / Stress',
          },
        },
      },
    },
  });
};

const drawAMChart = (formattedData) => {
  // Lets look at a example from
  // https://www.amcharts.com/demos/line-graph/
  // Documentation
  // https://www.amcharts.com/docs/v5/getting-started/
  am5.ready(function () {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new('chartdiv');

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
        paddingLeft: 0,
      })
    );

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
      })
    );
    cursor.lineY.set('visible', false);

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: {
          timeUnit: 'day',
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          pan: 'zoom',
        }),
      })
    );

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var readinesSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Readiness',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'readiness',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY}',
        }),
      })
    );

    var stressSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Stress',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'stress_index',
        valueXField: 'date',
        stroke: am5.color(0xff0000),
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY}',
        }),
      })
    );

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      })
    );

    // Kun käytämme AM chartia se tarvitsee ajan millisekunteina
    console.log(formattedData);

    const data = formattedData.map((entry) => ({
      date: entry.timestamp,
      readiness: entry.readiness,
      stress_index: entry.stressIndex,
    }));

    readinesSeries.data.setAll(data);
    stressSeries.data.setAll(data);

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    readinesSeries.appear(1000);
    stressSeries.appear(1500);
    chart.appear(1000, 100);
  }); // end am5.ready()
};

export { getUserData, getUserInfo };

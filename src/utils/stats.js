import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getDuration, getFormatedDuration} from '../utils/event';

const BAR_HEIGHT = 55;
const DEFAULT_HEIGHT = 5;

const makeItemsUnique = (items) => [...new Set(items)];
const countEventsByType = (events, type) => {
  return events.filter((event) => event.type === type).length;
};
const countCostByType = (events, type) => {
  const eventsByType = events.filter((event) => event.type === type);
  let totalCost = 0;
  eventsByType.forEach((item) => totalCost += item.cost);
  return totalCost;
};
const countDurationByType = (events, type) => {
  const eventsByType = events.filter((event) => event.type === type);
  return eventsByType.map((item) => getDuration(item.timeStart, item.timeEnd)).reduce((accumulator, time) => accumulator + time);
};

const renderTypesChart = (typeCtx, events) => {
  const types = events.map((event) => event.type);
  const uniqueTypes = makeItemsUnique(types);
  const eventsByTypeCounts = uniqueTypes.map((item) => countEventsByType(events, item));
  const uniqueTypesUpperCase = uniqueTypes.map((item) => item.toUpperCase());
  typeCtx.height = uniqueTypesUpperCase.length ? BAR_HEIGHT * uniqueTypesUpperCase.length : BAR_HEIGHT * DEFAULT_HEIGHT;

  const typeChart = new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqueTypesUpperCase,
      datasets: [{
        data: eventsByTypeCounts,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
  return typeChart;
};
const renderMoneysChart = (moneyCtx, events) => {
  const types = events.map((event) => event.type);
  const uniqueTypes = makeItemsUnique(types);
  const eventsByPriceCounts = uniqueTypes.map((item) => countCostByType(events, item));
  const uniqueTypesUpperCase = uniqueTypes.map((item) => item.toUpperCase());
  moneyCtx.height = uniqueTypesUpperCase.length ? BAR_HEIGHT * uniqueTypesUpperCase.length : BAR_HEIGHT * DEFAULT_HEIGHT;

  const moneyChart = new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqueTypesUpperCase,
      datasets: [{
        data: eventsByPriceCounts,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return moneyChart;
};
const renderDurationChart = (timeCtx, events) => {
  const types = events.map((event) => event.type);
  const uniqueTypes = makeItemsUnique(types);
  const eventsByDurationCounts = uniqueTypes.map((item) => countDurationByType(events, item));
  const uniqueTypesUpperCase = uniqueTypes.map((item) => item.toUpperCase());
  timeCtx.height = uniqueTypesUpperCase.length ? BAR_HEIGHT * uniqueTypesUpperCase.length : BAR_HEIGHT * DEFAULT_HEIGHT;

  const timeChart = new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqueTypesUpperCase,
      datasets: [{
        data: eventsByDurationCounts,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${getFormatedDuration(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return timeChart;
};

export {
  renderTypesChart,
  renderMoneysChart,
  renderDurationChart
};

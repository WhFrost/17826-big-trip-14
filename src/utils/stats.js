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

const getChart = (ctx, title, labels, data, formatter) => {
  const typeChart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
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
          formatter: formatter,
        },
      },
      title: {
        display: true,
        text: `${title}`,
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

const renderTypesChart = (typeCtx, events) => {
  const title = 'TYPE';
  const types = events.map((event) => event.type);
  const uniqueTypes = makeItemsUnique(types);
  const eventsByTypeCounts = uniqueTypes.map((item) => countEventsByType(events, item));
  const uniqueTypesUpperCase = uniqueTypes.map((item) => item.toUpperCase());
  typeCtx.height = uniqueTypesUpperCase.length ? BAR_HEIGHT * uniqueTypesUpperCase.length : BAR_HEIGHT * DEFAULT_HEIGHT;
  const getTypeFormat = () => {
    return (val) => `${val}x`;
  };
  const typeFormat = getTypeFormat();

  const typeChart = getChart(typeCtx, title, uniqueTypesUpperCase, eventsByTypeCounts, typeFormat);
  return typeChart;
};
const renderMoneysChart = (moneyCtx, events) => {
  const title = 'MONEY';
  const types = events.map((event) => event.type);
  const uniqueTypes = makeItemsUnique(types);
  const eventsByPriceCounts = uniqueTypes.map((item) => countCostByType(events, item));
  const uniqueTypesUpperCase = uniqueTypes.map((item) => item.toUpperCase());
  moneyCtx.height = uniqueTypesUpperCase.length ? BAR_HEIGHT * uniqueTypesUpperCase.length : BAR_HEIGHT * DEFAULT_HEIGHT;
  const getMoneyFormat = () => {
    return (val) => `€ ${val}`;
  };
  const moneyFormat = getMoneyFormat();

  const moneyChart = getChart(moneyCtx, title, uniqueTypesUpperCase, eventsByPriceCounts, moneyFormat);
  return moneyChart;
};
const renderDurationChart = (timeCtx, events) => {
  const title = 'TIME-SPEND';
  const types = events.map((event) => event.type);
  const uniqueTypes = makeItemsUnique(types);
  const eventsByDurationCounts = uniqueTypes.map((item) => countDurationByType(events, item));
  const uniqueTypesUpperCase = uniqueTypes.map((item) => item.toUpperCase());
  timeCtx.height = uniqueTypesUpperCase.length ? BAR_HEIGHT * uniqueTypesUpperCase.length : BAR_HEIGHT * DEFAULT_HEIGHT;
  const getTimeFormat = () => {
    return (val) => `${getFormatedDuration(val)}`;
  };
  const moneyFormat = getTimeFormat();

  const timeChart = getChart(timeCtx, title, uniqueTypesUpperCase, eventsByDurationCounts, moneyFormat);
  return timeChart;
};

export {
  renderTypesChart,
  renderMoneysChart,
  renderDurationChart
};

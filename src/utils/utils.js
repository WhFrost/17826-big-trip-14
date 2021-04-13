import dayjs from 'dayjs';
import {RenderPosition} from '../const';

const renderElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div'); // 1
  newElement.innerHTML = template; // 2

  return newElement.firstChild; // 3
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const getRandomInteger = (min, max) => {
  return min + Math.floor(Math.random() * (max + 1 - min));
};

const getRandomItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const humanizeDate = (format, date) => {
  return dayjs(date).format(format);
};

const sortingEventsByDate = (events) => events.sort((a, b) => {
  if (a.date > b.date) {
    return 1;
  } if (a.date < b.date) {
    return -1;
  }
  return 0;
});

export {
  renderElement,
  createElement,
  render,
  getRandomInteger,
  getRandomItem,
  humanizeDate,
  sortingEventsByDate
};

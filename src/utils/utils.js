import dayjs from 'dayjs';

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
  render,
  getRandomInteger,
  getRandomItem,
  humanizeDate,
  sortingEventsByDate
};

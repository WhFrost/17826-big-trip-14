import dayjs from 'dayjs';

const humanizeDate = (format, date) => {
  return dayjs(date).format(format);
};

const getDuration = (timeStart, timeEnd) => {
  return dayjs(timeEnd).diff(timeStart, 'minute', true);
};

const getFormatedDuration = (duration) => {
  const days = Math.trunc(duration / 24 / 60);
  const hours = Math.trunc((duration / 60) % 24);
  const minutes = Math.round(duration % 60);
  if (days < 1) {
    return hours + 'H ' + minutes + 'M';
  }
  if (days < 1 && hours < 1) {
    return minutes + 'M';
  }
  return days + 'D ' + hours + 'H ' + minutes + 'M';
};

const sortingEventsByDate = (a, b) => dayjs(a.timeStart).diff(dayjs(b.timeStart));
const sortingEventsByTime = (a, b) => dayjs(b.timeEnd - b.timeStart).diff(dayjs(a.timeEnd - a.timeStart));
const sortingEventsByPrice = (a, b) => b.cost - a.cost;

const isDatesEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');
};

const isEventWillBe = (event) => {
  return dayjs().isBefore(event, 'D');
};
const isEventExpired = (event) => {
  return dayjs().isAfter(event, 'D');

};

export {
  humanizeDate,
  getDuration,
  getFormatedDuration,
  sortingEventsByDate,
  sortingEventsByTime,
  sortingEventsByPrice,
  isDatesEqual,
  isEventWillBe,
  isEventExpired
};

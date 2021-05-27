import dayjs from 'dayjs';

const humanizeDate = (format, date) => {
  return dayjs(date).format(format);
};

const getDuration = (timeStart, timeEnd) => {
  return dayjs(timeEnd).diff(timeStart, 'minute', true);
};

const sortingEventsByDate = (a, b) => dayjs(a.date).diff(dayjs(b.date));
const sortingEventsByTime = (a, b) => dayjs(b.duration).diff(dayjs(a.duration));
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
  sortingEventsByDate,
  sortingEventsByTime,
  sortingEventsByPrice,
  isDatesEqual,
  isEventWillBe,
  isEventExpired
};

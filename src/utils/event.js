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

export {
  humanizeDate,
  getDuration,
  sortingEventsByDate,
  sortingEventsByTime,
  sortingEventsByPrice
};

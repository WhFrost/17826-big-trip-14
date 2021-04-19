import dayjs from 'dayjs';

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
  humanizeDate,
  sortingEventsByDate
};

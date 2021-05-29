import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {TYPES} from './mock/event';

const COUNT_EVENT_FOR_EMPTY_LIST = 0;

const BLANK_EVENT = {
  id: nanoid(),
  date: dayjs(),
  type: TYPES[0],
  city: '',
  timeStart: dayjs(),
  timeEnd: dayjs(),
  cost: '',
  offers: [],
  destination: {
    description: [],
    photos: [],
  },
};

const headerContainer = document.querySelector('.page-header');
const tripMainContainer = headerContainer.querySelector('.trip-main');


const SortTypes = {
  DAY: 'sort-day',
  EVENT: 'sort-event',
  TIME: 'sort-time',
  PRICE: 'sort-price',
  OFFERS: 'sort-offer',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const MenuItem = {
  TABLE: 'TABLE',
  STATISTICS: 'STATISTICS',
};

export {
  COUNT_EVENT_FOR_EMPTY_LIST,
  BLANK_EVENT,
  tripMainContainer,
  SortTypes,
  UserAction,
  UpdateType,
  FilterType,
  MenuItem
};

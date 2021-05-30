const COUNT_EVENT_FOR_EMPTY_LIST = 0;

const BLANK_EVENT = {
  type: 'taxi',
  timeStart: new Date(),
  timeEnd: new Date(),
  isFavorite: false,
  cost: '',
  offers: [],
  destination: {
    name: '',
    description: [],
    pictures: [],
  },
};

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

const MessageWhenOffline = {
  DISCONNECT: 'Lost internet connection',
  RECONNECT: 'Connection restored',
  NEW_EVENT: 'You can\'t create new event offline',
  EDIT_EVENT: 'You can\'t edit event offline',
  SAVE_EVENT: 'You can\'t save event offline',
  DELETE_EVENT: 'You can\'t delete event offline',
};

const TITLE_OFFLINE = ' [offlint]';

export {
  COUNT_EVENT_FOR_EMPTY_LIST,
  BLANK_EVENT,
  SortTypes,
  UserAction,
  UpdateType,
  FilterType,
  MenuItem,
  MessageWhenOffline,
  TITLE_OFFLINE
};

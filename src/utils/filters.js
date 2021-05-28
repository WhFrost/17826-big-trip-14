import {isEventWillBe, isEventExpired} from './event';
import {FilterType} from '../const';

const filter = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event.date),
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventWillBe(event.date)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventExpired(event.date)),
};

export {
  filter
};

import {isEventWillBe, isEventExpired} from './event';
import {FilterType} from '../const';

const filter = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event.timeStart),
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventWillBe(event.timeStart)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventExpired(event.timeStart)),
};

export {
  filter
};

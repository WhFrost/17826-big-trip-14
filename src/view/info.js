import {humanizeDate} from '../utils/utils';

const createTripCities = (events) => {
  if (events.length >= 3) {
    return `<h1 class="trip-info__title">
    ${events[0].city + ' &mdash; ... &mdash; ' + events[events.length - 1].city}
    </h1>`;
  }
  if (events.length > 0 && events.length < 3) {
    return `<h1 class="trip-info__title">
    ${events.map((event) => event.city).join(' &mdash; ')}
    </h1>`;
  }
  return '';
};

const createTripDates = (events) => {
  if (events.length > 0) {
    const dateBegin = humanizeDate('MMM DD', events[0].date);
    const dateEnd = humanizeDate('MMM DD', events[events.length - 1].date);
    return `<p class="trip-info__dates">${dateBegin}&nbsp;&mdash;&nbsp;${dateEnd}</p>`;
  }
  return '';
};

export const createTripInfo = (events) => {
  const cities = createTripCities(events);
  const tripDates = createTripDates(events);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
    ${cities}
    ${tripDates}
    </div>
    </section>`;
};

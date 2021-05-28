import Observer from '../utils/observer.js';

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(events) {
    this._events = events.slice();
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this._events.splice(index, 1, update);

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this._events.splice(index, 1);

    this._notify(updateType, update);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
      {},
      event,
      {
        timeStart: event.date_from !== null ? new Date(event.date_from) : event.date_from,
        timeEnd: event.date_to !== null ? new Date(event.date_to) : event.date_to,
        cost: event.base_price,
        isFavorite: event.is_favorite,
      },
    );

    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.base_price;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }
  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
      {},
      event,
      {
        'date_from': event.timeStart instanceof Date ? event.timeStart.toISOString() : null,
        'date_to': event.timeEnd instanceof Date ? event.timeEnd.toISOString() : null,
        'base_price': event.cost,
        'is_favorite': event.isFavorite,
      },
    );

    delete adaptedEvent.timeStart;
    delete adaptedEvent.timeEnd;
    delete adaptedEvent.cost;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}

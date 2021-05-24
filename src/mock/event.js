import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {
  getRandomInteger,
  getRandomItem
} from '../utils/common';
import {generateOffersByTypes} from './offers';
import {generateDestinationByCity} from './destination';

const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const CITIES = ['Praga', 'Moscow', 'Riga', 'Samara', 'Munchen', 'Berlin'];
const MIN_COST = 10;
const MAX_COST = 1000;

const MAX_DAY_GAP = 5;
const MIN_TIME_GAP = 100;
const MAX_TIME_GAP = 300;

const destinationsByCities = generateDestinationByCity(CITIES);
const getDestinationByCity = (destinations, city) => {
  return destinations.get(city);
};

const offersByTypes = generateOffersByTypes(TYPES);
const getOffersByType = (offers, type) => {
  return offers.get(type);
};

const generateEvent = () => {
  const id = nanoid();
  const date = dayjs().add(getRandomInteger(-MAX_DAY_GAP, MAX_DAY_GAP), 'day').add(getRandomInteger(MIN_TIME_GAP, MAX_TIME_GAP), 'minute');
  const type = getRandomItem(TYPES);
  const city = getRandomItem(CITIES);
  const timeStart = date.toDate();
  const timeEnd = dayjs(timeStart).add(getRandomInteger(MIN_TIME_GAP, MAX_TIME_GAP), 'minute');
  const duration = dayjs(timeEnd).diff(timeStart, 'minute');
  const isFavorite = Boolean(getRandomInteger(0, 1));
  const availableOffers = getOffersByType(offersByTypes, type.toLowerCase());
  const generateOffers = () => {
    return getRandomItem(availableOffers);
  };
  const offers = new Array (getRandomInteger(0, availableOffers.length)).fill().map(generateOffers);
  const destination = getDestinationByCity(destinationsByCities, city.toLowerCase());

  return {
    id,
    date,
    type,
    city,
    timeStart,
    timeEnd,
    duration,
    cost: getRandomInteger(MIN_COST, MAX_COST),
    isFavorite,
    offers,
    destination,
  };
};
export {
  TYPES,
  CITIES,
  offersByTypes,
  destinationsByCities,
  generateEvent
};

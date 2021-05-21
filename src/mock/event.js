import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {
  getRandomInteger,
  getRandomItem
} from '../utils/common';
import {generateOffersByTypes} from './offers';

const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const CITIES = ['Praga', 'Moscow', 'Riga', 'Samara', 'Munchen', 'Berlin'];
const MIN_COST = 10;
const MAX_COST = 1000;
const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 5;
const MAX_DAY_GAP = 5;
const MIN_TIME_GAP = 100;
const MAX_TIME_GAP = 300;

const offersByTypes = generateOffersByTypes(TYPES);
const getOffersByType = (offers, type) => {
  return offers.get(type);
};

const DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];
const MIN_PHOTOS_LENGTH = 0;
const MAX_PHOTOS_LENGTH = 5;
const PHOTOS = [
  `http://picsum.photos/248/152?r=${Math.random()}`,
  `http://picsum.photos/248/152?r=${Math.random()}`,
  `http://picsum.photos/248/152?r=${Math.random()}`,
  `http://picsum.photos/248/152?r=${Math.random()}`,
  `http://picsum.photos/248/152?r=${Math.random()}`,
];

const generateDescription = () => {
  return getRandomItem(DESCRIPTION);
};
const generatePhotos = () => {
  return getRandomItem(PHOTOS);
};

const generateEvent = () => {
  const id = nanoid();
  const date = dayjs().add(getRandomInteger(-MAX_DAY_GAP, MAX_DAY_GAP), 'day').add(getRandomInteger(MIN_TIME_GAP, MAX_TIME_GAP), 'minute');
  const type = getRandomItem(TYPES);
  const timeStart = date.toDate();
  const timeEnd = dayjs(timeStart).add(getRandomInteger(MIN_TIME_GAP, MAX_TIME_GAP), 'minute');
  const duration = dayjs(timeEnd).diff(timeStart, 'minute');
  const isFavorite = Boolean(getRandomInteger(0, 1));
  const availableOffers = getOffersByType(offersByTypes, type.toLowerCase());
  const generateOffers = () => {
    return getRandomItem(availableOffers);
  };
  const offers = new Array (getRandomInteger(0, availableOffers.length)).fill().map(generateOffers);
  const description = new Array(getRandomInteger(MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH)).fill().map(generateDescription);
  const photos = new Array(getRandomInteger(MIN_PHOTOS_LENGTH, MAX_PHOTOS_LENGTH)).fill().map(generatePhotos);

  return {
    id,
    date,
    type,
    city: getRandomItem(CITIES),
    timeStart,
    timeEnd,
    duration,
    cost: getRandomInteger(MIN_COST, MAX_COST),
    isFavorite,
    offers,
    destination: {
      description,
      photos,
    },
  };
};
export {
  TYPES,
  CITIES,
  offersByTypes,
  generateEvent
};

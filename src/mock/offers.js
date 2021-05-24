import {
  getRandomInteger,
  getRandomItem
} from '../utils/common';

const MIN_COUNT = 1;
const MAX_COUNT = 5;
const MIN_COST = 1;
const MAX_COST = 100;
const OFFERS_TITLE = [
  'Добавить багаж',
  'Повышенный комфорт',
  'Добавить питание',
  'Выбор места',
  'Путешествие на поезде',
];
const OFFERS_ID = [
  'event-luggage',
  'event-comfort',
  'event-meal',
  'event-seats',
  'event-train',
];
const generateCost = () => {
  return getRandomInteger(MIN_COST, MAX_COST);
};

const generateOffersByTypes = (types) => {
  const offersByTypes = new Map();
  types.forEach((type) => {
    const formatedType = type.toLowerCase();
    const offers =[];
    const count = getRandomInteger(MIN_COUNT, MAX_COUNT);
    for (let i = 0; i < count; i++) {

      const offersCosts = new Array(getRandomInteger(MIN_COUNT, MAX_COUNT)).fill().map(generateCost);
      offers.push({
        title: getRandomItem(OFFERS_TITLE),
        id: getRandomItem(OFFERS_ID),
        cost: getRandomItem(offersCosts),
      });
    }
    offersByTypes.set(formatedType, offers);
  });
  return offersByTypes;
};

export {
  generateOffersByTypes
};

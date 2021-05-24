import {
  getRandomInteger,
  getRandomItem
} from '../utils/common';

const MIN_DESCRIPTION_COUNT = 1;
const MAX_DESCRIPTION_COUNT = 5;
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
const MIN_PHOTOS_COUNT = 0;
const MAX_PHOTOS_COUNT = 5;
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

const generateDestinationByCity = (cities) => {
  const destinationsByCity = new Map();
  cities.forEach((city) => {
    const formatedCity = city.toLowerCase();
    const description = new Array(getRandomInteger(MIN_DESCRIPTION_COUNT, MAX_DESCRIPTION_COUNT))
      .fill().map(generateDescription);
    const photos = new Array(getRandomInteger(MIN_PHOTOS_COUNT, MAX_PHOTOS_COUNT))
      .fill().map(generatePhotos);
    destinationsByCity.set(formatedCity,
      {
        description,
        photos,
      });
  });
  return destinationsByCity;
};

export {
  generateDestinationByCity
};

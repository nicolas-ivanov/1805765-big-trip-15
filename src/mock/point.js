import { nanoid } from 'nanoid';
import { getRandomInteger, getRandomArrayElements } from '../utils/common.js';
import { generateDatePair, getCurrentDate } from '../utils/date.js';

const POINTS_COUNT = 15;

const POINT_TYPE = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const extraOptions = {
  taxi: [
    {
      id: 'business',
      title: 'Upgrade to a business class',
      price: 120,
    }, {
      id: 'radio',
      title: 'Choose the radio station',
      price: 60,
    },
  ],
  bus: [
    {
      id: 'luggage',
      title: 'Add luggage',
      price: 30,
    }, {
      id: 'seats',
      title: 'Choose seats',
      price: 600,
    },
  ],
  train: [
    {
      id: 'window',
      title: 'Look through the window',
      price: 12,
    }, {
      id: 'toilet',
      title: 'Go to the toilet',
      price: 360,
    },
  ],
  ship: [
    {
      id: 'sharks',
      title: 'Swim with sharks',
      price: 12,
    }, {
      id: 'whales',
      title: 'Feed a whale',
      price: 66,
    }, {
      id: 'fishing',
      title: 'Fishing in the moonlight',
      price: 44,
    },
  ],
  drive: [
    {
      id: 'speeding',
      title: 'Speeding up',
      price: 20,
    }, {
      id: 'tesla',
      title: 'Switch to Tesla Plaid',
      price: 60000,
    },
  ],
  flight: [
    {
      id: 'cabin',
      title: 'Have a personal cabin',
      price: 120,
    }, {
      id: 'call_mom',
      title: 'Call Mom',
      price: 60,
    },
  ],
  'check-in': [
    {
      id: 'bad',
      title: 'Have a king-size bad',
      price: 200,
    }, {
      id: 'blackjack',
      title: 'Add blackjack',
      price: 300,
    }, {
      id: 'stuff',
      title: 'Add other stuff',
      price: 500,
    },
  ],
  sightseeing: [
    {
      id: 'look_around',
      title: 'Look around',
      price: 12,
    }, {
      id: 'pee',
      title: 'Have a pee',
      price: 60,
    },
  ],
  restaurant: [
    {
      id: 'menu',
      title: 'See the menu',
      price: 12,
    }, {
      id: 'menu_again',
      title: 'See the menu again',
      price: 60,
    }, {
      id: 'menu_x3',
      title: 'See the menu one more time',
      price: 120,
    },
  ],
};

const getPhoto = () => `http://picsum.photos/248/152?r=${  Math.random()}`;

export const cities = [
  {
    name: 'Moscow',
    description: 'Moscow is the best city in the world. It is super nice and stuff. They paid me a whole sh*t of money to write these lines, so I can not help praising these bastards, I mean, trully amazing people. Come visit Moscow ASAP. Cheers.',
    photos: new Array(getRandomInteger(1, 4)).fill().map(() => getPhoto()),
  },
  {
    name: 'San Francisco',
    description: 'San Francisco is the best city in the world. It is super nice and stuff. They paid me a whole sh*t of money to write these lines, so I can not help praising these bastards, I mean, trully amazing people. Come visit San Francisco ASAP. Cheers.',
    photos: new Array(getRandomInteger(1, 4)).fill().map(() => getPhoto()),
  },
  {
    name: 'Amsterdam',
    description: 'Amsterdam is the best city in the world. It is super nice and stuff. They paid me a whole sh*t of money to write these lines, so I can not help praising these bastards, I mean, trully amazing people. Come visit Amsterdam ASAP. Cheers.',
    photos: new Array(getRandomInteger(1, 4)).fill().map(() => getPhoto()),
  },
  {
    name: 'Chamonix',
    description: 'Chamonix is the best city in the world. It is super nice and stuff. They paid me a whole sh*t of money to write these lines, so I can not help praising these bastards, I mean, trully amazing people. Come visit Chamonix ASAP. Cheers.',
    photos: new Array(getRandomInteger(1, 4)).fill().map(() => getPhoto()),
  },
  {
    name: 'Geneva',
    description: 'Geneva is the best city in the world. It is super nice and stuff. They paid me a whole sh*t of money to write these lines, so I can not help praising these bastards, I mean, trully amazing people. Come visit Geneva ASAP. Cheers.',
    photos: new Array(getRandomInteger(1, 4)).fill().map(() => getPhoto()),
  },
  {
    name: 'Tokio',
    description: 'Tokio is the best city in the world. It is super nice and stuff. They paid me a whole sh*t of money to write these lines, so I can not help praising these bastards, I mean, trully amazing people. Come visit Tokio ASAP. Cheers.',
    photos: new Array(getRandomInteger(1, 4)).fill().map(() => getPhoto()),
  },
];

const getSelecteOptionsIDs = (pointType) => extraOptions[pointType].map((optionData) => optionData.id);

export const generatePoint = () => {
  const selectedPointType = POINT_TYPE[getRandomInteger(0, POINT_TYPE.length - 1)];
  const selectedCity = cities[getRandomInteger(0, cities.length - 1)];
  const selectedOptions = getSelecteOptionsIDs(selectedPointType);
  const [start, end] = generateDatePair();

  return {
    id: nanoid(),
    basePrice: 50 * getRandomInteger(1, 100),
    startTime: start,
    endTime: end,
    pointType: selectedPointType,
    destination: selectedCity.name,
    offers: getRandomArrayElements(selectedOptions, getRandomInteger(0, selectedOptions.length - 1)),
    description: selectedCity.description,
    photos: selectedCity.photos,
    isFavorite: !getRandomInteger(0, 1),
  };
};

export const generatedPoints = Array.from(Array(POINTS_COUNT), generatePoint);

const DEFAULT_POINT_TYPE = 'taxi';
const CURRENT_DATE = getCurrentDate();

export const BLANK_POINT = {
  pointType: DEFAULT_POINT_TYPE,
  basePrice: null,
  startTime: CURRENT_DATE,
  endTime:  CURRENT_DATE,
  destination: null,
  offers: [],
  description: null,
  photos: null,
  isFavorite: null,
};

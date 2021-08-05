import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const getTimeDiffDisplay = (startTime, endTime) => {
  const duration = dayjs.duration(endTime.diff(startTime));

  if (duration.hours() < 1) {
    return duration.format('mm[M]');
  } else if (duration.hours() < 24) {
    return duration.format('HH[H] mm[M]');
  } else {
    return duration.format('dd[D] HH[H] mm[M]');
  }
};

const getOffersDisplay = (offers) => {
  return offers.map((offer) => {
    return `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`;
  }).join('');
};

export const tripPoint = (pointData, id) => {
  const startTime = dayjs(pointData.startTime);
  const endTime = dayjs(pointData.endTime);

  return `<li id="${id}" class="trip-events__item">
    <div class="event">
    <time class="event__date" datetime="${startTime.format('YYYY-MM-DD')}">${startTime.format('D MMM')}</time>
    <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${pointData.pointType}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${pointData.pointType} ${pointData.destination}</h3>
    <div class="event__schedule">
        <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18Thh:mm">${startTime.format('HH:mm')}</time>
        &mdash;
        <time class="event__end-time" datetime="${endTime.format('YYYY-MM-DDThh:mm')}">${endTime.format('HH:mm')}</time>
        </p>
        <p class="event__duration">${getTimeDiffDisplay(startTime, endTime)}</p>
    </div>
    <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${pointData.basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
        ${getOffersDisplay(pointData.offers)}
    </ul>
    <button class="event__favorite-btn event__favorite-btn${pointData.isFavorite ? '--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
    </button>
    <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
    </button>
    </div>
    </li>`;
};

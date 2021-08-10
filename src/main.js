import { renderElement, RenderPosition } from './utils.js';
import SiteMenu from './view/site-menu.js';
import Filters from './view/filters.js';
import TripInfo from './view/trip-info.js';
import Sorting from './view/sorting.js';
import TripPoint from './view/trip-point.js';
import NoPoints from './view/no-points.js';
import EditTripPointForm from './view/edit-point.js';
import { generatedPoints } from './fixtures.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteTripControlsElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteEventsElement = document.querySelector('.trip-events');

const renderPoint = (pointContainerElement, point) => {
  const pointElement = new TripPoint(point).getElement();
  const pointFormElement = new EditTripPointForm(point).getElement();

  const replaceCardToForm = () => {
    pointContainerElement.replaceChild(pointFormElement, pointElement);
  };

  const replaceFormToCard = () => {
    pointContainerElement.replaceChild(pointElement, pointFormElement);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const rollDownButton = pointElement.querySelector('.event__rollup-btn');
  rollDownButton.addEventListener('click', () => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  const rollUpButton = pointFormElement.querySelector('.event__rollup-btn');
  rollUpButton.addEventListener('click', replaceFormToCard);

  pointFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  renderElement(pointContainerElement, pointElement, RenderPosition.BEFOREEND);
};

const renderTripList = (tripListContainer, tripPoints) => {
  if (generatedPoints.length === 0) {
    renderElement(siteEventsElement, new NoPoints().getElement(), RenderPosition.AFTERBEGIN);
  } else {
    renderElement(siteEventsElement, new Sorting().getElement(), RenderPosition.AFTERBEGIN);

    const siteEventsListElement = tripListContainer.querySelector('.trip-events__list');
    tripPoints.forEach(point => renderPoint(siteEventsListElement, point));
  }
};

renderElement(siteTripControlsElement, new SiteMenu().getElement(), RenderPosition.AFTERBEGIN);
renderElement(siteTripControlsElement, new Filters().getElement(), RenderPosition.BEFOREEND);
renderElement(siteHeaderElement, new TripInfo(generatedPoints).getElement(), RenderPosition.AFTERBEGIN);
renderTripList(siteEventsElement, generatedPoints);

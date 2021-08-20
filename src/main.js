import { render, replace, RenderPosition } from './utils/render.js';
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
  const pointElement = new TripPoint(point);
  const pointFormElement = new EditTripPointForm(point);

  const replaceCardToForm = () => {
    replace(pointFormElement, pointElement);
  };

  const replaceFormToCard = () => {
    replace(pointElement, pointFormElement);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointElement.setClickHandler(() => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointFormElement.setClickHandler(replaceFormToCard);

  pointFormElement.setSubmitHandler(() => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointContainerElement, pointElement, RenderPosition.BEFOREEND);
};

const renderTripList = (tripListContainer, tripPoints) => {
  if (generatedPoints.length === 0) {
    render(siteEventsElement, new NoPoints().getElement(), RenderPosition.AFTERBEGIN);
  } else {
    render(siteEventsElement, new Sorting().getElement(), RenderPosition.AFTERBEGIN);

    const siteEventsListElement = tripListContainer.querySelector('.trip-events__list');
    tripPoints.forEach((point) => renderPoint(siteEventsListElement, point));
  }
};

render(siteTripControlsElement, new SiteMenu().getElement(), RenderPosition.AFTERBEGIN);
render(siteTripControlsElement, new Filters().getElement(), RenderPosition.BEFOREEND);
render(siteHeaderElement, new TripInfo(generatedPoints).getElement(), RenderPosition.AFTERBEGIN);
renderTripList(siteEventsElement, generatedPoints);

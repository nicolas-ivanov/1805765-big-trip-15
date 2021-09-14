import AbstractView from './abstract.js';
import { MenuItem } from '../const.js';

export default class SiteMenuView extends AbstractView{
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.getAttribute('value'));
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const allTabs = this.getElement().getElementsByClassName('trip-tabs__btn');
    Array.from(allTabs).forEach((element) => {
      element.classList.remove('trip-tabs__btn--active');
    });

    const activeTab = this.getElement().querySelector(`[value=${menuItem}]`);

    if (activeTab !== null) {
      activeTab.classList.add('trip-tabs__btn--active');
    }
  }

  getTemplate () {
    return `<div class="trip-controls__navigation">
      <h2 class="visually-hidden">Switch trip view</h2>
      <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" value="${MenuItem.POINTS}">Table</a>
      <a class="trip-tabs__btn" href="#" value="${MenuItem.STATISTICS}">Stats</a>
      </nav>
    </div>`;
  }
}

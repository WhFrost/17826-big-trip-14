import EventView from '../view/event';
import EditEventFormView from '../view/edit-event';
import {render, RenderPosition, replace, remove} from '../utils/render';

export default class Event {
  constructor(eventsListContainer, changeData) {
    this._eventsListContainer = eventsListContainer;
    this._changeData = changeData;

    this._eventComponent = null;
    this._editEventFormComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleEditFormClick = this._handleEditFormClick.bind(this);
    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEditEventFormComponent = this._editEventFormComponent;

    this._eventComponent = new EventView(this._event);
    this._editEventFormComponent = new EditEventFormView(this._event);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editEventFormComponent.setEditFormClickHandler(this._handleEditFormClick);
    this._editEventFormComponent.setEditFormSubmitClickHandler(this._handleEditFormSubmit);

    if (prevEventComponent === null || prevEditEventFormComponent === null) {
      render(this._eventsListContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._eventsListContainer.getElement().contains(prevEventComponent.getElement())) {
      replace(this._eventComponent, prevEventComponent);
    }
    if (this._eventsListContainer.getElement().contains(prevEditEventFormComponent.getElement())) {
      replace(this._editEventFormComponent, prevEditEventFormComponent);
    }

    remove(prevEventComponent);
    remove(prevEditEventFormComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventFormComponent);
  }

  _replaceEventToEditEventForm() {
    replace(this._editEventFormComponent, this._eventComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }
  _replaceEditEventFormToEvent() {
    replace(this._eventComponent, this._editEventFormComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }
  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceEditEventFormToEvent();
    }
  }
  _handleEditClick() {
    this._replaceEventToEditEventForm();
  }
  _handleEditFormClick() {
    this._replaceEditEventFormToEvent();
  }
  _handleEditFormSubmit() {
    this._replaceEditEventFormToEvent();
  }
  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }
}

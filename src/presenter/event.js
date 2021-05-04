import EventView from '../view/event';
import EditEventFormView from '../view/edit-event';
import {render, RenderPosition, replace} from '../utils/render';

export default class Event {
  constructor(eventsListContainer) {
    this._eventsListContainer = eventsListContainer;

    this._eventComponent = null;
    this._editEventFormComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleEditFormClick = this._handleEditFormClick.bind(this);
    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(event) {
    this._event = event;
    this._eventComponent = new EventView(this._event);
    this._editEventFormComponent = new EditEventFormView(this._event);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._editEventFormComponent.setEditFormClickHandler(this._handleEditFormClick);
    this._editEventFormComponent.setEditFormSubmitClickHandler(this._handleEditFormSubmit);

    render(this._eventsListContainer, this._eventComponent, RenderPosition.BEFOREEND);
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
}

import EventView from '../view/event';
import EditEventFormView from '../view/edit-event';
import {render, RenderPosition, replace, remove} from '../utils/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Event {
  constructor(eventsListContainer, changeData, changeMode) {
    this._eventsListContainer = eventsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._editEventFormComponent = null;
    this._mode = Mode.DEFAULT;

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
    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }
    if (this._mode === Mode.EDITING) {
      replace(this._editEventFormComponent, prevEditEventFormComponent);
    }

    remove(prevEventComponent);
    remove(prevEditEventFormComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventFormComponent);
  }
  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditEventFormToEvent();
    }
  }

  _replaceEventToEditEventForm() {
    replace(this._editEventFormComponent, this._eventComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }
  _replaceEditEventFormToEvent() {
    replace(this._eventComponent, this._editEventFormComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }
  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._editEventFormComponent.reset(this._event);
      this._replaceEditEventFormToEvent();
    }
  }
  _handleEditClick() {
    this._replaceEventToEditEventForm();
  }
  _handleEditFormClick() {
    this._replaceEditEventFormToEvent();
  }
  _handleEditFormSubmit(event) {
    this._changeData(event);
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

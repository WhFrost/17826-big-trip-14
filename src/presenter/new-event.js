import EditEventFormView from '../view/edit-event';
import {render, RenderPosition, remove} from '../utils/render';
import {UserAction, UpdateType} from '../const';

export default class EventNew {
  constructor(eventsListContainer, changeData) {
    this._eventsListContainer = eventsListContainer;
    this._changeData = changeData;

    this._editEventFormComponent = null;

    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._handleEditFormDeleteClick = this._handleEditFormDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._editEventFormComponent !== null) {
      return;
    }
    this._editEventFormComponent = new EditEventFormView();
    this._editEventFormComponent.setEditFormSubmitClickHandler(this._handleEditFormSubmit);
    this._editEventFormComponent.setEditFormDeleteClickHandler(this._handleEditFormDeleteClick);

    render(this._eventsListContainer, this._editEventFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._editEventFormComponent);
    this._editEventFormComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleEditFormSubmit(event) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      Object.assign({}, event),
    );
    this.destroy();
  }

  _handleEditFormDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}

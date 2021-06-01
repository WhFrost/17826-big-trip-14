import EventView from '../view/event';
import EditEventFormView from '../view/edit-event';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {UserAction, UpdateType, MessageWhenOffline} from '../const';
import {isDatesEqual, isPriceEqual} from '../utils/event';
import {offersModel, destinationsModel} from '../main';
import {isOnline} from '../utils/common';
import {toast} from '../utils/toast';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
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
    this._handleEditFormDeleteClick = this._handleEditFormDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEditEventFormComponent = this._editEventFormComponent;

    const availableOffers = offersModel.getOffers();
    const availableDestinations = destinationsModel.getDestinations();

    this._eventComponent = new EventView(this._event);
    this._editEventFormComponent = new EditEventFormView(this._event, availableOffers, availableDestinations);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editEventFormComponent.setEditFormClickHandler(this._handleEditFormClick);
    this._editEventFormComponent.setEditFormSubmitClickHandler(this._handleEditFormSubmit);
    this._editEventFormComponent.setEditFormDeleteClickHandler(this._handleEditFormDeleteClick);

    if (prevEventComponent === null || prevEditEventFormComponent === null) {
      render(this._eventsListContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }
    if (this._mode === Mode.EDITING) {
      replace(this._eventComponent, prevEditEventFormComponent);
      this._mode = Mode.DEFAULT;
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

  setViewState(state) {
    const resetFormState = () => {
      this._editEventFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    switch (state) {
      case State.SAVING:
        this._editEventFormComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._editEventFormComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._editEventFormComponent.shake(resetFormState);
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
    if (!isOnline()) {
      toast(MessageWhenOffline.EDIT_EVENT);
      this.setViewState(State.ABORTING);
      return;
    }
    this._replaceEventToEditEventForm();
  }
  _handleEditFormClick() {
    this._editEventFormComponent.reset(this._event);
    this._replaceEditEventFormToEvent();
  }
  _handleEditFormSubmit(event) {
    if (!isOnline()) {
      toast(MessageWhenOffline.SAVE_EVENT);
      this.setViewState(State.ABORTING);
      return;
    }

    const isMinorUpdate = !isDatesEqual(this._event.timeStart, event.timeStart) ||
    isPriceEqual(this._event.price, event.price);

    this._changeData(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      event,
    );
    this._replaceEditEventFormToEvent();
  }
  _handleEditFormDeleteClick(event) {
    if (!isOnline()) {
      toast(MessageWhenOffline.DELETE_EVENT);
      this.setViewState(State.ABORTING);
      return;
    }

    this._changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MAJOR,
      event,
    );
  }
  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
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

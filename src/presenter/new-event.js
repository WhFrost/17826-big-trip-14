import AddEventFormView from '../view/add-event';
import {render, RenderPosition, remove} from '../utils/render';
import {UserAction, UpdateType, BLANK_EVENT} from '../const';
import {offersModel, destinationsModel} from '../main';

export default class EventNew {
  constructor(eventsListContainer, changeData) {
    this._eventsListContainer = eventsListContainer;
    this._changeData = changeData;

    this._addEventFormComponent = null;

    this._handleAddFormSubmit = this._handleAddFormSubmit.bind(this);
    this._handleAddFormDeleteClick = this._handleAddFormDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._addEventFormComponent !== null) {
      return;
    }

    const availableOffers = offersModel.getOffers();
    const availableDestinations = destinationsModel.getDestinations();

    this._addEventFormComponent = new AddEventFormView(BLANK_EVENT, availableOffers, availableDestinations);
    this._addEventFormComponent.setAddFormSubmitClickHandler(this._handleAddFormSubmit);
    this._addEventFormComponent.setAddFormDeleteClickHandler(this._handleAddFormDeleteClick);

    render(this._eventsListContainer, this._addEventFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._addEventFormComponent === null) {
      return;
    }

    remove(this._addEventFormComponent);
    this._addEventFormComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._addEventFormComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }
  setAborting() {
    const resetFormState = () => {
      this._addEventFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._addEventFormComponent._offersCheckHandler(resetFormState);
  }

  _handleAddFormSubmit(event) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      Object.assign({}, event),
    );
  }

  _handleAddFormDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}

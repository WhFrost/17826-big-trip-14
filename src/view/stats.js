import SmartView from './smart.js';
import {renderTypesChart, renderMoneysChart, renderDurationChart} from '../utils/stats';

const createStatsTemplate = () => {
  return `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`;
};

export default class Stats extends SmartView {
  constructor(events) {
    super();
    this._data = events;
    this._typesChart = null;
    this._moneysChart = null;
    this._durationChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  removeElement() {
    super.removeElement();

    if (this._typesChart !== null || this._moneysChart !== null || this._durationChart !== null) {
      this._typesChart = null;
      this._moneysChart = null;
      this._durationChart = null;
    }
  }

  _setCharts() {
    if (this._typesChart !== null || this._moneysChart !== null || this._durationChart !== null) {
      this._typesChart = null;
      this._moneysChart = null;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    this._typesChart = renderTypesChart(typeCtx, this._data);
    this._moneysChart = renderMoneysChart(moneyCtx, this._data);
    this._durationChart = renderDurationChart(timeCtx, this._data);
  }
}

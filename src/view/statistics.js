import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getTotalPrice, getTotalDuration } from '../utils/point.js';
import { simultaneousSort } from '../utils/common.js';
import { getTimeDiffDisplayFromMSec } from '../utils/date.js';


const barChart = (title, context, labels, data, customFormatter) => new Chart(context, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        formatter: customFormatter,
      },
    },
    title: {
      display: true,
      text: title,
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    datasets: {
      barThickness: 44,
      minBarLength: 50,
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});


const createStatisticsTemplate = () =>
  `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="money" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="type" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
  </div>
</section>`;


export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._data = points;

    this._setCharts();
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector('#money');
    const typeCtx = this.getElement().querySelector('#type');
    const timeCtx = this.getElement().querySelector('#time-spend');

    const pointTypes = [... new Set(this._data.map((point) => point.pointType))];
    const moneyData = pointTypes.map((type) => (getTotalPrice(this._data.filter((point) => point.pointType === type))));
    const typesCountData = pointTypes.map((type) => (this._data.filter((point) => point.pointType === type)).length);
    const timeSpendData = pointTypes.map((type) => (getTotalDuration(this._data.filter((point) => point.pointType === type))));

    const pointTypesUppercase = pointTypes.map((type) => type.toUpperCase());

    const [moneyDataSorted, pointTypesSortedByMoney] = simultaneousSort(moneyData, pointTypesUppercase);
    const [typesCountDataSorted, pointTypesSortedByTypesCount] = simultaneousSort(typesCountData, pointTypesUppercase);
    const [timeSpendDataSorted, pointTypesSortedByTimeSpend] = simultaneousSort(timeSpendData, pointTypesUppercase);

    // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
    const BAR_HEIGHT = 45;
    moneyCtx.height = BAR_HEIGHT * pointTypes.length;
    typeCtx.height = BAR_HEIGHT * pointTypes.length;
    timeCtx.height = BAR_HEIGHT * pointTypes.length;

    const moneyFormatter = (val) => `€ ${val}`;
    const typeCountFormatter = (val) => `${val}x`;
    const timeSpendFormatter = (val) => `${getTimeDiffDisplayFromMSec(val)}`;

    barChart('MONEY', moneyCtx, pointTypesSortedByMoney, moneyDataSorted, moneyFormatter);
    barChart('TYPE', typeCtx, pointTypesSortedByTypesCount, typesCountDataSorted, typeCountFormatter);
    barChart('TIME-SPEND', timeCtx, pointTypesSortedByTimeSpend, timeSpendDataSorted, timeSpendFormatter);
  }
}

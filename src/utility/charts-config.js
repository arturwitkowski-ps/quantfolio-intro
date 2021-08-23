const stockSymbols = ['', 'VTVT', 'LOB', 'NTRA', 'OLLI', 'RUN', 'CNFR', 'RPD'];

const stockCurrencies = {
  EUR: 'EUR',
  NOK: 'NOK',
  USD: 'USD'
};

const stockColors = [
  '',
  'red',
  'yellow',
  'green',
  'royalblue',
  'aqua',
  'hotpink',
  'darkblue',
];

const createHighchartsConfig = (seriesData) => ({
    series: seriesData ?? [],
    chart: {
      type: 'ohlc',
      backgroundColor: 'transparent',
      style: {
        color: '#FFF',
      },
    },
    tooltip: {
      split: false
    },
    xAxis: {
      labels: {
        style: {
          color: '#FFF',
        },
      },
      title: {
        style: {
          color: '#FFF',
        },
      },
    },
    yAxis: {
      lineColor: '#DDD',
      labels: {
        style: {
          color: '#FFF',
        },
      },
      title: {
        style: {
          color: '#FFF',
        },
      },
    },
    navigator: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    rangeSelector: {
      inputEnabled: false,
      allButtonsEnabled: true,
      labelStyle: {
        color: 'white',
      },
      buttons: [
        {
          type: 'year',
          count: 1,
          text: '1Y',
          dataGrouping: {
            units: [['day', [1]]],
          },
        },
        {
          type: 'year',
          count: 5,
          text: '5Y',
          dataGrouping: {
            units: [['day', [1]]],
          },
        },
        {
          type: 'all',
          text: 'MAX',
          dataGrouping: {
            units: [['day', [1]]],
          },
        },
      ],
      buttonTheme: {
        width: 40,
      },
      selected: 0,
    },
  });


export {
  createHighchartsConfig,
  stockColors,
  stockSymbols,
  stockCurrencies,
}
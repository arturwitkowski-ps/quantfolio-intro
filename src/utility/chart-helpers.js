const stockCurrencies = {
  EUR: 'EUR',
  NOK: 'NOK',
  USD: 'USD'
};

const stockColors = [
  'red',
  'yellow',
  'green',
  'royalblue',
  'aqua',
  'hotpink',
  'darkblue',
];

const createSeriesFromData = (selectedStocks, stocksInfo) => {
  const stockSeries = [];
  selectedStocks.forEach(oneDay => {
    const newStockRecord = [
      (new Date(oneDay.recorded)).getTime(),
      oneDay.open,
      oneDay.high,
      oneDay.low,
      oneDay.close,
    ];

    const foundStock = stockSeries.find(stock => stock._id === oneDay.stock_id)
    if (foundStock) {
      foundStock.data.push(newStockRecord)
    } else {
      const stockName = stocksInfo.find(searchedStock => searchedStock.id === oneDay.stock_id);

      stockSeries.push({
        data: [newStockRecord],
        name: stockName.name,
        color: stockColors[oneDay.stock_id - 1],
        turboThreshold: 20000,
        _id: oneDay.stock_id,
      });
    }
  })

  return stockSeries
}

const createHighchartsConfig = (handleZoom = () => {}) => ({
    series: [],
    chart: {
      type: 'ohlc',
      backgroundColor: 'transparent',
      style: {
        color: '#FFF',
      },
      panning: {
        enabled: false
      }
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
    scrollbar: {
      enabled: false,
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
          events: {
            click: () => handleZoom('1y')
          }
        },
        {
          type: 'year',
          count: 5,
          text: '5Y',
          dataGrouping: {
            units: [['day', [1]]],
          },
          events: {
            click: () => handleZoom('5y')
          }
        },
        {
          type: 'all',
          text: 'MAX',
          dataGrouping: {
            units: [['day', [1]]],
          },
          events: {
            click: () => handleZoom('max')
          }
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
  stockCurrencies,
  createSeriesFromData,
}
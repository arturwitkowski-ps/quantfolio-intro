import React from 'react'
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

import { stockCurrencies } from '../../utility/chart-helpers';

import './StocksChart.css';

Highcharts.setOptions({
  lang: {
    rangeSelectorZoom: 'Period'
  },
})

const StocksChart = ({ 
  highchartsConfig, 
  chartComponent, 
  changeCurrency, 
  selectedCurrency,
}) => {
  return (
    <section className="chart">
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={highchartsConfig}
        ref={chartComponent}
      />
      <div className="currency">
        {Object.values(stockCurrencies).map(curr => (
          <div
            key={curr}
            className={`currency-button${selectedCurrency === curr ? ' currency-button--selected' : ''}`}
            onClick={() => changeCurrency(curr)}
          >{curr}</div>
        ))}
      </div>
    </section>
  )
}

export default StocksChart

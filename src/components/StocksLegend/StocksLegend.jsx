import React from 'react'

import { stockColors } from '../../utility/chart-helpers';

import './StocksLegend.css';

const StocksLegend = ({ stocksInfo, selectedStocks, toggleStock, highlightStock }) => {
  return (
    <section className="legend">
      {stocksInfo ? stocksInfo.map(({ name, id, symbol }) => (
        <div
          key={`stockLegend-${id}`}
          className={`legend-stock${!selectedStocks.includes(symbol) ? ' legend-stock--hidden' : ''
            }`}
          onClick={() => toggleStock(symbol)}
          onMouseEnter={() => highlightStock(name, 'hover')}
          onMouseLeave={() => highlightStock(name, 'normal')}
        >
          <div
            className="stock-circle"
            style={{ backgroundColor: stockColors[id - 1] }}
          ></div>
          <div className="legend-text">{name}</div>
        </div>
      )) : <div className="loading"><h3>Loading...</h3></div>}
    </section>
  )
}

export default StocksLegend

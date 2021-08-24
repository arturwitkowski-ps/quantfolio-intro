import React from 'react'

import { stockColors } from '../../utility/chart-helpers'

import './StocksTable.css'

const StocksTable = ({stocksInfo, zoom}) => {
  return (
    <section className="stocks">
      <table>
        <thead>
          <tr>
            <td></td>
            <td>Stock</td>
            <td>CAGR</td>
            <td>Sharpe</td>
          </tr>
        </thead>
        <tbody>
          {stocksInfo ? stocksInfo.map((stock) => (
            <tr key={`stockTable-${stock.id}`}>
              <td>
                <div
                  className="stock-circle"
                  style={{ backgroundColor: stockColors[stock.id - 1] }}
                ></div>
              </td>
              <td>{stock.name}</td>
              <td>{`${stock[zoom].cagr}%`}</td>
              <td>{stock[zoom].sharpe}</td>
            </tr>
          )) : null}
        </tbody>
      </table>
      {!stocksInfo ? <div className="loading"><h3>Loading...</h3></div> : ''}
    </section>
  )
}

export default StocksTable

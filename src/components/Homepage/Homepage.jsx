import React, { useState, useRef, useEffect, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

import Logo from '../../images/logo-bright.png';
import { getStocksData, getStocks } from '../../utility/api';
import { createHighchartsConfig, stockColors, stockCurrencies } from '../../utility/charts-config';

import './Homepage.css';

const Homepage = () => {
  const chartComponent = useRef(null);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [stocksInfo, setStocksInfo] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState(stockCurrencies.USD);
  const [highchartsConfig, setHighchartsConfig] = useState(createHighchartsConfig());

  const loadStocks = useCallback((pickedStocks, pickedCurrency) => {
    console.log('load')
    if (!stocksInfo) return;
    chartComponent.current.chart.showLoading();

    getStocks(pickedStocks, pickedCurrency, stocksInfo)
      .then((stockSeries) => {
        console.log('loadeded')
        setHighchartsConfig(createHighchartsConfig(stockSeries));
      })
      .catch(err => console.log(err))
      .finally(() => 
        chartComponent.current.chart.hideLoading()
      );
  }, [stocksInfo]);

  useEffect(() => {
    getStocksData()
      .then(data => data.json())
      .then((fetchedStocksData) => {
        fetchedStocksData = fetchedStocksData.filter(stockDataElement => stockDataElement.type === 'Common Stack')
        fetchedStocksData.sort((a, b) => a.id > b.id)
        setStocksInfo(fetchedStocksData)
      })
      .catch(err => console.log(err))
  }, []);

  const changeCurrency = (currency) => {
    setSelectedCurrency(currency);
    loadStocks(selectedStocks, currency);
  }

  const toggleStock = (stockSymbol) => {
    setSelectedStocks((oldSelectedStocks) => {
      const position = oldSelectedStocks.indexOf(stockSymbol);
      const newSelectedStocks = [...oldSelectedStocks];
      
      if (position !== -1) {
        newSelectedStocks.splice(position, 1);
      } else {
        newSelectedStocks.push(stockSymbol);
      }


      loadStocks(newSelectedStocks, selectedCurrency)
      return newSelectedStocks;
    });
  };

  return (
    <div className="introProject">
      <header>
        <img src={Logo} alt="Quantfol.io logo" />
      </header>
      <main>
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
                className={`currency-button${selectedCurrency === curr ? ' currency-button--selected': ''}`}
                onClick={() => changeCurrency(curr)}
              >{curr}</div>
            ))}
          </div>
        </section>
        <section className="legend">
        {stocksInfo ? stocksInfo.map(({ name, id, symbol }) => (
            <div
              key={`stockLegend-${id}`}
              className={`legend-stock${
                !selectedStocks.includes(symbol) ? ' legend-stock--hidden' : ''
              }`}
              onClick={() => toggleStock(symbol)}
            >
              <div
                className="stock-circle"
                style={{ backgroundColor: stockColors[id] }}
              ></div>
              <div className="legend-text">{name}</div>
            </div>
          )) : <div className="loading"><h3>Loading...</h3></div>}
        </section>
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
              {stocksInfo ? stocksInfo.map(({ name, max, id }) => (
                <tr key={`stockTable-${id}`}>
                  <td>
                    <div
                      className="stock-circle"
                      style={{ backgroundColor: stockColors[id] }}
                    ></div>
                  </td>
                  <td>{name}</td>
                  <td>{`${max.cagr}%`}</td>
                  <td>{max.sharpe}</td>
                </tr>
              )) : null}
            </tbody>
          </table>
          {!stocksInfo ? <div className="loading"><h3>Loading...</h3></div> : ''}
        </section>
      </main>
    </div>
  );
};

export default Homepage;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

import Logo from '../../images/logo-bright.png';
import { getStocksData, getStocks } from '../../utility/api';
import { createHighchartsConfig, stockColors, stockCurrencies } from '../../utility/chart-helpers';

import './Homepage.css';

const Homepage = () => {
  const chartComponent = useRef(null);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [stocksInfo, setStocksInfo] = useState();
  const [zoom, setZoom] = useState('1y');
  const [selectedCurrency, setSelectedCurrency] = useState(stockCurrencies.USD);
  const [highchartsConfig, setHighchartsConfig] = useState(createHighchartsConfig(setZoom));

  const loadStocks = useCallback((pickedStocks, pickedCurrency) => {
    if (!stocksInfo) return;
    chartComponent.current.chart.showLoading();

    // const stocksToFetch = pickedStocks.filter(())
    getStocks(pickedStocks, pickedCurrency, stocksInfo)
      .then((stockSeries) => {
        setHighchartsConfig(config => ({ series: stockSeries }));
      })
      .catch(err => console.log(err))
      .finally(() => 
        chartComponent.current.chart.hideLoading()
      );
  }, [stocksInfo]);
  
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
  
  const highlightStock = (stockName, newState) => {
    if (selectedStocks.length === 0) return;
    const foundStock = chartComponent.current.chart.series.find(series => series.name === stockName);
    const restOfStocks = chartComponent.current.chart.series.filter(series => series.name !== stockName)
    
    if(!foundStock) return;
    foundStock.points.forEach(point => {
      point.setState(newState)
    });
    if (newState === 'hover') {
      restOfStocks.forEach(stock => stock.points.forEach(point => point.setState('inactive')))
    } else {
      restOfStocks.forEach(stock => stock.points.forEach(point => point.setState('normal')));
    }
  }
  
    useEffect(() => {
      getStocksData()
        .then((fetchedStocksData) => {
          fetchedStocksData.sort((a, b) => a.id > b.id)
          setStocksInfo(fetchedStocksData)
        })
        .catch(err => console.log(err));
    }, []);
  
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
      </main>
    </div>
  );
};

export default Homepage;

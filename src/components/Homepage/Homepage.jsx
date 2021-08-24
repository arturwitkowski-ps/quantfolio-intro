import React, { useState, useRef, useEffect, useCallback } from 'react';

import Logo from '../../images/logo-bright.png';
import { getStocksData, getStocks } from '../../utility/api';
import { createHighchartsConfig, stockCurrencies } from '../../utility/chart-helpers';

import './Homepage.css';
import StocksTable from '../StocksTable/StocksTable';
import StocksLegend from '../StocksLegend/StocksLegend';
import StocksChart from '../StocksChart/StocksChart';

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

    getStocks(pickedStocks, pickedCurrency, stocksInfo)
      .then((stockSeries) => {
        setHighchartsConfig({ series: stockSeries });
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

    if(!foundStock) return;
    foundStock.points.forEach(point => {
      point.setState(newState)
    });
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
        <StocksChart 
          highchartsConfig={highchartsConfig} 
          chartComponent={chartComponent} 
          changeCurrency={changeCurrency} 
          selectedCurrency={selectedCurrency} 
        />
        <StocksLegend 
          stocksInfo={stocksInfo} 
          selectedStocks={selectedStocks} 
          toggleStock={toggleStock} 
          highlightStock={highlightStock} 
        />
        <StocksTable stocksInfo={stocksInfo} zoom={zoom} />
      </main>
    </div>
  );
};

export default Homepage;

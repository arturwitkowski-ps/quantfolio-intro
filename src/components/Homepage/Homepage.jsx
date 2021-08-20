import React, { useState, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

import Logo from '../../images/logo-bright.png';
import './Homepage.css';
import exampleData from './example-data';

const stockColors = [
  'red',
  'yellow',
  'green',
  'royalblue',
  'aqua',
  'hotpink',
  'darkblue',
];

const defaultHighchartsOptions = {
  series: [
    {
      data: exampleData,
    },
  ],
  plotOptions: {
    series: {
      type: 'ohlc',
    },
  },
  chart: {
    backgroundColor: 'transparent',
    style: {
      color: '#FFF',
    },
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
          forced: true,
          units: [['day', [1]]],
        },
      },
      {
        type: 'year',
        count: 5,
        text: '5Y',
        dataGrouping: {
          forced: true,
          units: [['day', [1]]],
        },
      },
      {
        type: 'all',
        text: 'MAX',
        dataGrouping: {
          forced: true,
          units: [['day', [1]]],
        },
      },
    ],
    buttonTheme: {
      width: 40,
    },
    selected: 1,
  },
};

const Homepage = () => {
  const chartComponent = useRef(null);
  const [selectedStocks, setSelectedStocks] = useState([1]);

  const toggleStock = (index) => {
    if (isNaN(index)) return;

    setSelectedStocks((oldSelectedStocks) => {
      const position = oldSelectedStocks.indexOf(index);
      if (position !== -1) {
        const newSelectedStocks = [...oldSelectedStocks];
        newSelectedStocks.splice(position, 1);
        return newSelectedStocks;
      } else {
        return [...oldSelectedStocks, index];
      }
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
            options={defaultHighchartsOptions}
            ref={chartComponent}
          />
        </section>
        <section className="legend">
          {[1, 2, 3, 4, 5, 6, 7].map((index) => (
            <div
              key={`stockLegend-${index}`}
              className={`legend-stock${
                !selectedStocks.includes(index) ? ' legend-stock--hidden' : ''
              }`}
              onClick={() => toggleStock(index)}
            >
              <div
                className="stock-circle"
                style={{ backgroundColor: stockColors[index - 1] }}
              ></div>
              <div className="legend-text">Stock {index}</div>
            </div>
          ))}
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
              {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                <tr key={`stockTable-${index}`}>
                  <td>
                    <div
                      className="stock-circle"
                      style={{ backgroundColor: stockColors[index - 1] }}
                    ></div>
                  </td>
                  <td>Stock {index}</td>
                  <td>xx</td>
                  <td>xx</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Homepage;

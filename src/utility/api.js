import { stockColors } from "./charts-config";

const API_URL = "http://vps-a4acc035.vps.ovh.net:8000";

const getStocksData = () => fetch(`${API_URL}/stocks?period=1,5,max`);

const getStocks =
  (symbols, currency = 'USD', stocksInfo) =>
    fetch(`${API_URL}/time_series?stocks=${symbols.join()}&currency=${currency}`)
      .then(data => data.json())
      .then((fetchedSelectedStocks) => {
        const stockSeries = [];
        fetchedSelectedStocks.forEach(oneDay => {
          const newStockRecord = [
            (new Date(oneDay.recorded)).getTime(),
            oneDay.open,
            oneDay.high,
            oneDay.low,
            oneDay.close,
          ];

          if (oneDay.stock_id in stockSeries) {
            stockSeries[oneDay.stock_id].data.push(newStockRecord)
          } else {
            const stockName = stocksInfo.find(searchedStock => searchedStock.id === oneDay.stock_id);

            stockSeries[oneDay.stock_id] = {
              data: [newStockRecord],
              name: stockName.name,
              color: stockColors[oneDay.stock_id - 1],
              turboThreshold: 20000
            };
          }
        })
        return stockSeries;
      });

export {
  getStocksData,
  getStocks,
}
import { createSeriesFromData } from "./chart-helpers";

const API_URL = "http://vps-a4acc035.vps.ovh.net:8000";

const getStocksData = () => fetch(`${API_URL}/stocks?period=1,5,max`).then(data => data.json());

const getStocks =
  (symbols, currency, stocksInfo) =>
    fetch(`${API_URL}/time_series?stocks=${symbols.join()}&currency=${currency}`)
      .then(data => data.json())
      .then((fetchedSelectedStocks) => {
        return createSeriesFromData(fetchedSelectedStocks, stocksInfo);
      });

export {
  getStocksData,
  getStocks,
}
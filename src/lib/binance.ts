import type { CandleData } from "./types";

const BINANCE_API_URL = "https://api.binance.com/api/v3/klines";

/**
 * Fetches k-line (candlestick) data from Binance.
 * @param symbol The trading pair symbol (e.g., 'BTCUSDT').
 * @param interval The time interval (e.g., '1h', '4h', '1d').
 * @param limit The number of data points to fetch.
 * @returns A promise that resolves to an array of CandleData.
 */
export async function getKlines(
  symbol: string,
  interval: string,
  limit: number = 200
): Promise<CandleData[]> {
  const response = await fetch(
    `${BINANCE_API_URL}?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch data from Binance API: ${response.statusText}`);
  }

  const data = await response.json();

  return data.map((d: any) => ({
    time: d[0] / 1000, // Convert from ms to seconds for lightweight-charts
    open: parseFloat(d[1]),
    high: parseFloat(d[2]),
    low: parseFloat(d[3]),
    close: parseFloat(d[4]),
    value: parseFloat(d[5]), // Volume
    color: parseFloat(d[4]) > parseFloat(d[1]) ? '#26a69a' : '#ef5350',
  }));
}

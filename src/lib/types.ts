import type { Time } from "lightweight-charts";

export interface CandleData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface VolumeData {
  time: Time;
  value: number;
  color: string;
}

export type TradeSignal = {
  entryPriceRange: string;
  takeProfitLevels: string | string[];
  stopLoss: string;
};

export type AnalysisResult = {
  analysisSummary: string;
  tradeSignal: TradeSignal;
};

export type HistoryEntry = {
  id: string;
  ticker: string;
  timestamp: Date;
  model: "normal" | "ultra";
  analysis: AnalysisResult;
};

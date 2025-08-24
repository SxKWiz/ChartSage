"use server";

import { analyzeChartNormal as analyzeChartNormalFlow } from "@/ai/flows/analyze-chart-normal";
import { analyzeChartUltra as analyzeChartUltraFlow } from "@/ai/flows/analyze-chart-ultra";
import type { AnalysisResult } from "./types";
import { revalidatePath } from "next/cache";

// This would interact with a database like Firebase Firestore.
// For now, it's a placeholder.
async function saveAnalysisToHistory(
  ticker: string,
  model: "normal" | "ultra",
  analysis: AnalysisResult
) {
  console.log("Saving analysis to history:", { ticker, model, analysis });
  // In a real app, you would add this to Firestore and then revalidate the history page.
  revalidatePath("/history");
  return Promise.resolve();
}

export async function getNormalAnalysis(
  chartDataUri: string,
  ticker: string
): Promise<AnalysisResult> {
  const result = await analyzeChartNormalFlow({ chartDataUri, ticker });

  const finalResult = {
    analysisSummary: result.analysisSummary,
    tradeSignal: {
      ...result.tradeSignal,
    },
  };

  // await saveAnalysisToHistory(ticker, "normal", finalResult);
  return finalResult;
}

export async function getUltraAnalysis(
  chartData: string,
  ticker: string
): Promise<AnalysisResult> {
  const result = await analyzeChartUltraFlow({ chartData });
  const finalResult = {
    analysisSummary: result.analysisSummary,
    tradeSignal: {
      ...result.tradeSignal,
    },
  };
  // await saveAnalysisToHistory(ticker, "ultra", finalResult);
  return finalResult;
}

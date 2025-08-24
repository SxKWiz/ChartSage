"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/use-settings";
import TradingViewChart, {
  type TradingViewChartRef,
} from "@/components/tradingview-chart";
import { getKlines } from "@/lib/binance";
import type { CandleData, AnalysisResult } from "@/lib/types";
import { getNormalAnalysis, getUltraAnalysis } from "@/lib/actions";
import AnalysisResultCard from "@/components/analysis-result-card";
import { CRYPTO_PAIRS, TIME_INTERVALS } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { WandSparkles, Cpu } from "lucide-react";

export default function Home() {
  const [pair, setPair] = useState(CRYPTO_PAIRS[0].value);
  const [interval, setInterval] = useState(TIME_INTERVALS[0].value);
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [isChartLoading, startChartLoadingTransition] = useTransition();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const chartRef = useRef<TradingViewChartRef>(null);
  const { toast } = useToast();
  const { analysisModel } = useSettings();

  const fetchChartData = () => {
    startChartLoadingTransition(async () => {
      try {
        const data = await getKlines(pair, interval);
        setChartData(data);
        setAnalysisResult(null);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: "Could not load chart data from Binance.",
        });
      }
    });
  };

  useEffect(() => {
    fetchChartData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair, interval]);

  const handleAnalysis = async () => {
    if (!chartRef.current) return;
    setIsAiLoading(true);
    setAnalysisResult(null);

    try {
      const chartDataUri = await chartRef.current.takeScreenshot();
      let result;
      if (analysisModel === "ultra") {
        result = await getUltraAnalysis(chartDataUri);
      } else {
        result = await getNormalAnalysis(chartDataUri, pair);
      }

      setAnalysisResult(result);
    } catch (error) {
      console.error("AI analysis failed:", error);
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "An error occurred during the analysis.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-6 overflow-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Chart Analyzer</h1>
          <p className="text-muted-foreground">
            Get AI-powered trade signals for crypto pairs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleAnalysis} disabled={isAiLoading || isChartLoading}>
            {analysisModel === "ultra" ? (
              <WandSparkles className="mr-2 h-4 w-4" />
            ) : (
              <Cpu className="mr-2 h-4 w-4" />
            )}
            {isAiLoading ? "Analyzing..." : `Run ${analysisModel} Analysis`}
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <CardTitle>{pair}</CardTitle>
              <CardDescription>
                Candlestick chart with real-time data from Binance.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={pair} onValueChange={setPair}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select pair" />
                </SelectTrigger>
                <SelectContent>
                  {CRYPTO_PAIRS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_INTERVALS.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[400px] md:h-[500px]">
          {isChartLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <TradingViewChart ref={chartRef} data={chartData} />
          )}
        </CardContent>
      </Card>

      {isAiLoading && (
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>
              The AI is analyzing the chart, please wait...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      )}

      {analysisResult && <AnalysisResultCard result={analysisResult} />}
    </main>
  );
}

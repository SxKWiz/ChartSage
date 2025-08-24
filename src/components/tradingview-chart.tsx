
"use client";

import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type HistogramData,
  type Time,
} from "lightweight-charts";
import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import type { CandleData, VolumeData } from "@/lib/types";

interface TradingViewChartProps {
  data: CandleData[];
}

export interface TradingViewChartRef {
  takeScreenshot: () => string;
}

const TradingViewChart = forwardRef<TradingViewChartRef, TradingViewChartProps>(
  ({ data }, ref) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

    useImperativeHandle(ref, () => ({
      takeScreenshot: () => {
        if (!chartRef.current) {
          throw new Error("Chart not initialized");
        }
        const canvas = chartRef.current.takeScreenshot();
        return canvas.toDataURL("image/png");
      },
    }));

    useEffect(() => {
      if (!chartContainerRef.current) return;

      const computedStyle = getComputedStyle(document.documentElement);
      const formatColor = (variable: string) => {
        const colorValue = computedStyle.getPropertyValue(variable).trim();
        // lightweight-charts expects hsl(h, s%, l%)
        const [h, s, l] = colorValue.split(" ");
        return `hsl(${h}, ${s}, ${l})`;
      }

      const textColor = formatColor('--foreground');
      const borderColor = formatColor('--border');
      
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: "transparent" },
          textColor: textColor,
        },
        grid: {
          vertLines: { color: borderColor },
          horzLines: { color: borderColor },
        },
        rightPriceScale: {
          borderColor: borderColor,
        },
        timeScale: {
          borderColor: borderColor,
          timeVisible: true,
          secondsVisible: false,
        },
        crosshair: {
          mode: 1, // Magnet
        },
      });

      chartRef.current = chart;
      candlestickSeriesRef.current = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderDownColor: "#ef5350",
        borderUpColor: "#26a69a",
        wickDownColor: "#ef5350",
        wickUpColor: "#26a69a",
      });

      volumeSeriesRef.current = chart.addHistogramSeries({
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "", // set as an overlay
      });
      chart.priceScale("").applyOptions({
        scaleMargins: {
          top: 0.7, // 70% space for main chart
          bottom: 0,
        },
      });

      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      };

      window.addEventListener("resize", handleResize);
      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(data as CandlestickData<Time>[]);
      }
      if (volumeSeriesRef.current) {
        const volumeData = data.map((d) => ({
          time: d.time,
          value: (d as any).value,
          color: (d as any).color,
        }));
        volumeSeriesRef.current.setData(volumeData as HistogramData<Time>[]);
      }
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }, [data]);

    return <div ref={chartContainerRef} className="w-full h-full" />;
  }
);

TradingViewChart.displayName = "TradingViewChart";
export default TradingViewChart;

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { HistoryEntry } from "@/lib/types";

// Mock data as Firebase is not configured
const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: "1",
    ticker: "BTC/USDT",
    timestamp: new Date("2023-10-27T10:00:00Z"),
    model: "ultra",
    analysis: {
      analysisSummary:
        "The chart shows a strong bullish trend with a recent breakout above a key resistance level. RSI is not yet overbought, suggesting potential for further upside.",
      tradeSignal: {
        entryPriceRange: "61000 - 61500",
        takeProfitLevels: ["63000", "65000"],
        stopLoss: "59500",
      },
    },
  },
  {
    id: "2",
    ticker: "ETH/USDT",
    timestamp: new Date("2023-10-27T09:30:00Z"),
    model: "normal",
    analysis: {
      analysisSummary:
        "A bearish divergence is forming on the 4H chart. Price is approaching a major support zone, a breakdown could lead to a significant drop.",
      tradeSignal: {
        entryPriceRange: "3900 - 3850",
        takeProfitLevels: "3700",
        stopLoss: "4050",
      },
    },
  },
    {
    id: "3",
    ticker: "SOL/USDT",
    timestamp: new Date("2023-10-26T15:00:00Z"),
    model: "ultra",
    analysis: {
      analysisSummary:
        "Consolidation within a symmetrical triangle pattern. A breakout in either direction is imminent. Volume is decreasing, confirming the consolidation phase.",
      tradeSignal: {
        entryPriceRange: "Wait for breakout confirmation.",
        takeProfitLevels: "N/A",
        stopLoss: "N/A",
      },
    },
  },
];

export default function HistoryPage() {
  const historyData = MOCK_HISTORY;

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-6">
       <div>
          <h1 className="text-2xl font-bold tracking-tight">Analysis History</h1>
          <p className="text-muted-foreground">
            A log of all past AI analyses.
          </p>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Past Analyses</CardTitle>
          <CardDescription>
            Review previously generated trade signals and analyses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Entry Range</TableHead>
                <TableHead>Take Profit</TableHead>
                <TableHead>Stop Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.ticker}</TableCell>
                  <TableCell>
                    {item.timestamp.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.model === 'ultra' ? 'default' : 'secondary'}>{item.model}</Badge>
                  </TableCell>
                  <TableCell>{item.analysis.tradeSignal.entryPriceRange}</TableCell>
                  <TableCell>{Array.isArray(item.analysis.tradeSignal.takeProfitLevels) ? item.analysis.tradeSignal.takeProfitLevels.join(', ') : item.analysis.tradeSignal.takeProfitLevels}</TableCell>
                  <TableCell>{item.analysis.tradeSignal.stopLoss}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

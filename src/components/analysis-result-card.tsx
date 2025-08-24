import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AnalysisResult } from "@/lib/types";
import { List, Target, XCircle, CheckCircle } from "lucide-react";

interface AnalysisResultCardProps {
  result: AnalysisResult;
}

export default function AnalysisResultCard({
  result,
}: AnalysisResultCardProps) {
  const { analysisSummary, tradeSignal } = result;

  const renderTakeProfit = () => {
    const levels = Array.isArray(tradeSignal.takeProfitLevels)
      ? tradeSignal.takeProfitLevels
      : [tradeSignal.takeProfitLevels];
    return levels.map((level, index) => <div key={index}>{level}</div>);
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>AI Analysis Result</CardTitle>
        <CardDescription>
          Here is the trade signal based on the chart analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <List className="w-4 h-4 text-primary" />
            Analysis Summary
          </h3>
          <p className="text-sm text-muted-foreground">{analysisSummary}</p>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-4">Trade Signal</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Entry Price Range</p>
                <p className="text-muted-foreground">
                  {tradeSignal.entryPriceRange}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Take Profit Levels</p>
                <div className="text-muted-foreground">{renderTakeProfit()}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Stop Loss</p>
                <p className="text-muted-foreground">{tradeSignal.stopLoss}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useSettings } from "@/hooks/use-settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Cpu, WandSparkles } from "lucide-react";

export default function SettingsPage() {
  const { analysisModel, setAnalysisModel } = useSettings();

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-6">
      <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your ChartSage experience.
          </p>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Model</CardTitle>
          <CardDescription>
            Choose the AI model for chart analysis. Ultra is more powerful but
            may be slower.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={analysisModel}
            onValueChange={(value) => setAnalysisModel(value as "normal" | "ultra")}
            className="grid gap-4"
          >
            <Label htmlFor="normal-model" className="flex items-start gap-4 rounded-md border p-4 hover:bg-accent/50 transition-colors cursor-pointer has-[[data-state=checked]]:border-primary">
                <RadioGroupItem value="normal" id="normal-model" />
                <div className="grid gap-1.5">
                    <div className="font-semibold flex items-center gap-2"><Cpu className="w-4 h-4"/> Normal Analysis</div>
                    <p className="text-sm text-muted-foreground">
                        Powered by Gemini 2.5 Flash. Fast and efficient for quick market checks.
                    </p>
                </div>
            </Label>
             <Label htmlFor="ultra-model" className="flex items-start gap-4 rounded-md border p-4 hover:bg-accent/50 transition-colors cursor-pointer has-[[data-state=checked]]:border-primary">
                <RadioGroupItem value="ultra" id="ultra-model" />
                <div className="grid gap-1.5">
                    <div className="font-semibold flex items-center gap-2"><WandSparkles className="w-4 h-4"/> Ultra Analysis</div>
                    <p className="text-sm text-muted-foreground">
                        Powered by Gemini 2.5 Pro. Provides more precise and in-depth analysis for critical trade decisions.
                    </p>
                </div>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>
    </main>
  );
}

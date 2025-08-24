'use server';

/**
 * @fileOverview A crypto chart analysis AI agent using Gemini 2.5 Pro for ultra analysis.
 *
 * - analyzeChartUltra - A function that handles the chart analysis process using Gemini 2.5 Pro.
 * - AnalyzeChartUltraInput - The input type for the analyzeChartUltra function.
 * - AnalyzeChartUltraOutput - The return type for the analyzeChartUltra function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeChartUltraInputSchema = z.object({
  chartData: z
    .string()
    .describe(
      'The candlestick chart data as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});
export type AnalyzeChartUltraInput = z.infer<typeof AnalyzeChartUltraInputSchema>;

const AnalyzeChartUltraOutputSchema = z.object({
  analysisSummary: z.string().describe('A summary of the candlestick chart analysis.'),
  tradeSignal: z.object({
    entryPriceRange: z.string().describe('The recommended entry price range.'),
    takeProfitLevels: z.string().describe('The recommended take profit levels.'),
    stopLoss: z.string().describe('The recommended stop loss level.'),
  }).describe('Trade signal based on the analysis.'),
});
export type AnalyzeChartUltraOutput = z.infer<typeof AnalyzeChartUltraOutputSchema>;

export async function analyzeChartUltra(input: AnalyzeChartUltraInput): Promise<AnalyzeChartUltraOutput> {
  return analyzeChartUltraFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeChartUltraPrompt',
  input: {schema: AnalyzeChartUltraInputSchema},
  output: {schema: AnalyzeChartUltraOutputSchema},
  prompt: `You are an expert financial analyst specializing in cryptocurrency trading. You are very strict and must not be creative or provide any randomness in your output.

You will analyze the provided candlestick chart and provide a summary analysis and a trade signal.

The trade signal must include the entry price range, take profit levels, and stop loss.

Candlestick Chart:
{{media url=chartData}}

Analysis Summary:
Trade Signal:`, 
  model: 'googleai/gemini-2.5-pro',
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  },
});

const analyzeChartUltraFlow = ai.defineFlow(
  {
    name: 'analyzeChartUltraFlow',
    inputSchema: AnalyzeChartUltraInputSchema,
    outputSchema: AnalyzeChartUltraOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';

/**
 * @fileOverview AI flow for analyzing a candlestick chart using Gemini 2.5 Flash and providing a trade signal.
 *
 * - analyzeChartNormal - A function that analyzes the chart and returns a trade signal.
 * - AnalyzeChartNormalInput - The input type for the analyzeChartNormal function.
 * - AnalyzeChartNormalOutput - The return type for the analyzeChartNormal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeChartNormalInputSchema = z.object({
  chartDataUri: z
    .string()
    .describe(
      "A candlestick chart image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  ticker: z.string().describe('The ticker symbol of the cryptocurrency pair.'),
});
export type AnalyzeChartNormalInput = z.infer<typeof AnalyzeChartNormalInputSchema>;

const AnalyzeChartNormalOutputSchema = z.object({
  analysisSummary: z.string().describe('A summary of the candlestick chart analysis.'),
  tradeSignal: z.object({
    entryPriceRange: z.string().describe('The recommended entry price range.'),
    takeProfitLevels: z.array(z.string()).describe('The recommended take profit levels.'),
    stopLoss: z.string().describe('The recommended stop loss price.'),
  }).describe('The trade signal based on the analysis.'),
});
export type AnalyzeChartNormalOutput = z.infer<typeof AnalyzeChartNormalOutputSchema>;

export async function analyzeChartNormal(input: AnalyzeChartNormalInput): Promise<AnalyzeChartNormalOutput> {
  return analyzeChartNormalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeChartNormalPrompt',
  input: {schema: AnalyzeChartNormalInputSchema},
  output: {schema: AnalyzeChartNormalOutputSchema},
  prompt: `You are a crypto trading expert. Analyze the candlestick chart provided and provide a summary analysis and a trade signal. Be strict and non-creative in your analysis.

  Ticker: {{{ticker}}}

  Chart:
  {{media url=chartDataUri}}

  Provide the analysis summary and trade signal in the following format:
  {
    analysisSummary: string,
    tradeSignal: {
      entryPriceRange: string,
      takeProfitLevels: string[],
      stopLoss: string
    }
  }`,
  model: 'googleai/gemini-2.5-flash',
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const analyzeChartNormalFlow = ai.defineFlow(
  {
    name: 'analyzeChartNormalFlow',
    inputSchema: AnalyzeChartNormalInputSchema,
    outputSchema: AnalyzeChartNormalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

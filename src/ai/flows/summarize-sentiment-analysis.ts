'use server';

/**
 * @fileOverview Summarizes sentiment data to identify mood trends over time.
 *
 * - summarizeSentimentAnalysis - A function that summarizes sentiment data.
 * - SummarizeSentimentAnalysisInput - The input type for the summarizeSentimentAnalysis function.
 * - SummarizeSentimentAnalysisOutput - The return type for the summarizeSentimentAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSentimentAnalysisInputSchema = z.object({
  sentimentData: z
    .string()
    .describe("The sentiment data to summarize, provided as a string."),
});

export type SummarizeSentimentAnalysisInput = z.infer<
  typeof SummarizeSentimentAnalysisInputSchema
>;

const SummarizeSentimentAnalysisOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the user\'s mood trends over time.'),
});

export type SummarizeSentimentAnalysisOutput = z.infer<
  typeof SummarizeSentimentAnalysisOutputSchema
>;

export async function summarizeSentimentAnalysis(
  input: SummarizeSentimentAnalysisInput
): Promise<SummarizeSentimentAnalysisOutput> {
  return summarizeSentimentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSentimentAnalysisPrompt',
  input: {schema: SummarizeSentimentAnalysisInputSchema},
  output: {schema: SummarizeSentimentAnalysisOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing sentiment data and providing concise summaries of mood trends over time. Generate a summary of the user's mood trends over time from the following data: {{{sentimentData}}}`,
});

const summarizeSentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'summarizeSentimentAnalysisFlow',
    inputSchema: SummarizeSentimentAnalysisInputSchema,
    outputSchema: SummarizeSentimentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

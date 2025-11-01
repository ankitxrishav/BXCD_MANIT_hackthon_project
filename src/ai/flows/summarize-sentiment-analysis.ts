
'use server';

/**
 * @fileOverview Summarizes sentiment data to identify mood trends over time.
 *
 * - summarizeSentimentAnalysis - A function that summarizes sentiment data.
 * - SummarizeSentimentAnalysisInput - The input type for the summarizeSentimentAnalysis function.
 * - SummarizeSentimentAnalysisOutput - The return type for the summarizeSentimentAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {
  SummarizeSentimentAnalysisInputSchema,
  SummarizeSentimentAnalysisOutputSchema,
  type SummarizeSentimentAnalysisInput,
  type SummarizeSentimentAnalysisOutput,
} from '@/ai/schemas';

export async function summarizeSentimentAnalysis(
  input: SummarizeSentimentAnalysisInput
): Promise<SummarizeSentimentAnalysisOutput> {
  return summarizeSentimentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSentimentAnalysisPrompt',
  input: {schema: SummarizeSentimentAnalysisInputSchema},
  output: {schema: SummarizeSentimentAnalysisOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing sentiment data and providing concise summaries of mood trends over time. Generate a one-paragraph summary of the user's mood trends from the current conversation, based on the following JSON data: {{{sentimentData}}}. Focus on the overall emotional arc and any significant shifts.`,
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

'use server';

/**
 * @fileOverview Analyzes the sentiment of a given text.
 *
 * - analyzeSentiment - A function that returns the sentiment of a text.
 * - SentimentAnalysisInput - The input type for the analyzeSentiment function.
 * - SentimentAnalysisOutput - The return type for the analyzeSentiment function.
 */

import {ai} from '@/ai/genkit';
import {
  SentimentAnalysisInputSchema,
  SentimentAnalysisOutputSchema,
  type SentimentAnalysisInput,
  type SentimentAnalysisOutput,
} from '@/ai/schemas';

export async function analyzeSentiment(
  input: SentimentAnalysisInput
): Promise<SentimentAnalysisOutput> {
  return sentimentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sentimentAnalysisPrompt',
  input: {schema: SentimentAnalysisInputSchema},
  output: {schema: SentimentAnalysisOutputSchema},
  prompt: `Analyze the sentiment of the following text. Identify the primary emotion and provide a sentiment score from -1 (very negative) to 1 (very positive).

Text: {{{text}}}
`,
});

const sentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'sentimentAnalysisFlow',
    inputSchema: SentimentAnalysisInputSchema,
    outputSchema: SentimentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

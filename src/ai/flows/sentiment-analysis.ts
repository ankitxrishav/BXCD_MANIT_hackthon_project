'use server';

/**
 * @fileOverview Analyzes the sentiment of a given text.
 *
 * - analyzeSentiment - A function that returns the sentiment of a text.
 * - SentimentAnalysisInput - The input type for the analyzeSentiment function.
 * - SentimentAnalysisOutput - The return type for the analyzeSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SentimentAnalysisInputSchema = z.object({
  text: z.string().describe('The text to analyze.'),
});
export type SentimentAnalysisInput = z.infer<
  typeof SentimentAnalysisInputSchema
>;

export const SentimentAnalysisOutputSchema = z.object({
  sentimentScore: z
    .number()
    .describe(
      'A numerical score representing the sentiment of the message (e.g., -1 for negative, 0 for neutral, 1 for positive).'
    ),
  emotion: z
    .string()
    .describe(
      "The identified primary emotion in the message (e.g., 'joy', 'sadness', 'anger', 'neutral')."
    ),
});
export type SentimentAnalysisOutput = z.infer<
  typeof SentimentAnalysisOutputSchema
>;

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

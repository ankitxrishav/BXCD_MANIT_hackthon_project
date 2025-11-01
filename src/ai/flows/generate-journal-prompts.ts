'use server';

/**
 * @fileOverview Generates journaling prompts based on a user's current emotion.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const JournalPromptsInputSchema = z.object({
  emotion: z.string().describe('The user\'s current primary emotion (e.g., "sadness", "joy").'),
});
export type JournalPromptsInput = z.infer<typeof JournalPromptsInputSchema>;

export const JournalPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('A list of 3-4 journaling prompts tailored to the user\'s emotion.'),
});
export type JournalPromptsOutput = z.infer<typeof JournalPromptsOutputSchema>;

export async function generateJournalPrompts(input: JournalPromptsInput): Promise<JournalPromptsOutput> {
  return generateJournalPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJournalPromptsPrompt',
  input: { schema: JournalPromptsInputSchema },
  output: { schema: JournalPromptsOutputSchema },
  prompt: `You are an empathetic AI companion. Your goal is to provide supportive and introspective journaling prompts.
Generate a list of 3-4 journaling prompts for a user feeling {{emotion}}. The prompts should be gentle, open-ended, and encourage self-reflection without being demanding.
- If the emotion is negative (e.g., sadness, anger), focus on exploring the feeling and finding comfort.
- If the emotion is positive (e.g., joy, contentment), focus on gratitude and savoring the moment.`,
});

const generateJournalPromptsFlow = ai.defineFlow(
  {
    name: 'generateJournalPromptsFlow',
    inputSchema: JournalPromptsInputSchema,
    outputSchema: JournalPromptsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

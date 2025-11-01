'use server';

/**
 * @fileOverview Generates journaling prompts based on a user's current emotion.
 */

import { ai } from '@/ai/genkit';
import { 
  JournalPromptsInputSchema, 
  JournalPromptsOutputSchema,
  type JournalPromptsInput,
  type JournalPromptsOutput
} from '@/ai/schemas';

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

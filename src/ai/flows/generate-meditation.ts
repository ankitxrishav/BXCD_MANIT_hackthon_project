'use server';

/**
 * @fileOverview Generates a short, guided meditation script.
 */

import { ai } from '@/ai/genkit';
import { 
  GenerateMeditationInputSchema, 
  GenerateMeditationOutputSchema, 
  type GenerateMeditationInput, 
  type GenerateMeditationOutput 
} from '@/ai/schemas';

export async function generateMeditation(input: GenerateMeditationInput): Promise<GenerateMeditationOutput> {
  return generateMeditationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMeditationPrompt',
  input: { schema: GenerateMeditationInputSchema },
  output: { schema: GenerateMeditationOutputSchema },
  prompt: `You are a calm and reassuring meditation guide.
Write a short, soothing, 2-3 paragraph guided meditation script about finding "{{topic}}".
Start with a sentence to help the user get comfortable, guide them through a simple breathing exercise, and end with a gentle return to awareness. Use simple language and a peaceful tone.
`,
});

const generateMeditationFlow = ai.defineFlow(
  {
    name: 'generateMeditationFlow',
    inputSchema: GenerateMeditationInputSchema,
    outputSchema: GenerateMeditationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

'use server';

/**
 * @fileOverview Provides personalized recommendations based on user's emotion and conversation context.
 *
 * - getPersonalizedRecommendation - A function that returns a personalized recommendation.
 * - PersonalizedRecommendationInput - The input type for the getPersonalizedRecommendation function.
 * - PersonalizedRecommendationOutput - The return type for the getPersonalizedRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {
  PersonalizedRecommendationInputSchema,
  PersonalizedRecommendationOutputSchema,
  type PersonalizedRecommendationInput,
  type PersonalizedRecommendationOutput,
} from '@/ai/schemas';

export async function getPersonalizedRecommendation(input: PersonalizedRecommendationInput): Promise<PersonalizedRecommendationOutput> {
  return personalizedRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationPrompt',
  input: {schema: PersonalizedRecommendationInputSchema},
  output: {schema: PersonalizedRecommendationOutputSchema},
  prompt: `You are a helpful AI assistant providing personalized recommendations to the user based on their current emotion and conversation context.

Emotion: {{{emotion}}}
Conversation Context: {{{conversationContext}}}

Provide a single, actionable recommendation. Act as a personal AI companion for mood and emotion tracking for a user.
`,
});

const personalizedRecommendationFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationFlow',
    inputSchema: PersonalizedRecommendationInputSchema,
    outputSchema: PersonalizedRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

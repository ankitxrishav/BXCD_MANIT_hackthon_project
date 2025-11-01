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
  prompt: `You are a helpful AI assistant providing personalized recommendations to a user based on their current emotion and conversation context. You act as a personal AI companion for mood and emotion tracking.

Emotion: {{{emotion}}}
Conversation Context: {{{conversationContext}}}

- If the user's emotion is negative (e.g., 'sadness', 'anger', 'anxiety', 'fear'), provide a list of 4-5 actionable suggestions to help them cope or feel better.
- If the user's emotion is positive or neutral (e.g., 'joy', 'contentment', 'neutral'), provide a single, short, encouraging, and rewarding message to affirm their positive state.
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

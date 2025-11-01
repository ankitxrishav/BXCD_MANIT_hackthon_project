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

export const PersonalizedRecommendationInputSchema = z.object({
  emotion: z.string().describe('The current emotion of the user.'),
  conversationContext: z
    .string()
    .describe('The recent conversation context with the user.'),
});
export type PersonalizedRecommendationInput = z.infer<
  typeof PersonalizedRecommendationInputSchema
>;

export const PersonalizedRecommendationOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of personalized recommendations for the user. Contains multiple items for negative emotions, and a single item for positive/neutral emotions.'),
});
export type PersonalizedRecommendationOutput = z.infer<
  typeof PersonalizedRecommendationOutputSchema
>;

export const SummarizeSentimentAnalysisInputSchema = z.object({
  sentimentData: z
    .string()
    .describe('A JSON string of sentiment data to summarize. Each item should have emotion, score, and text.'),
});

export type SummarizeSentimentAnalysisInput = z.infer<
  typeof SummarizeSentimentAnalysisInputSchema
>;

export const SummarizeSentimentAnalysisOutputSchema = z.object({
  summary: z
    .string()
    .describe("A concise, one-paragraph summary of the user's mood trends over time based on the data."),
});

export type SummarizeSentimentAnalysisOutput = z.infer<
  typeof SummarizeSentimentAnalysisOutputSchema
>;

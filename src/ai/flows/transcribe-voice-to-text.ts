'use server';

/**
 * @fileOverview Voice-to-text transcription flow.
 *
 * - transcribeVoiceToText - A function that handles the voice-to-text transcription process.
 * - TranscribeVoiceToTextInput - The input type for the transcribeVoiceToText function.
 * - TranscribeVoiceToTextOutput - The return type for the transcribeVoiceToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeVoiceToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A voice recording, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeVoiceToTextInput = z.infer<
  typeof TranscribeVoiceToTextInputSchema
>;

const TranscribeVoiceToTextOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio.'),
});
export type TranscribeVoiceToTextOutput = z.infer<
  typeof TranscribeVoiceToTextOutputSchema
>;

export async function transcribeVoiceToText(
  input: TranscribeVoiceToTextInput
): Promise<TranscribeVoiceToTextOutput> {
  return transcribeVoiceToTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeVoiceToTextPrompt',
  input: {schema: TranscribeVoiceToTextInputSchema},
  output: {schema: TranscribeVoiceToTextOutputSchema},
  prompt: `Transcribe the audio recording to text.\n\nAudio: {{media url=audioDataUri}}`,
});

const transcribeVoiceToTextFlow = ai.defineFlow(
  {
    name: 'transcribeVoiceToTextFlow',
    inputSchema: TranscribeVoiceToTextInputSchema,
    outputSchema: TranscribeVoiceToTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

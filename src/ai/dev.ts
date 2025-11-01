'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-recommendations.ts';
import '@/ai/flows/summarize-sentiment-analysis.ts';
import '@/ai/flows/sentiment-analysis.ts';
import '@/ai/flows/generate-meditation.ts';
import '@/ai/flows/generate-journal-prompts.ts';

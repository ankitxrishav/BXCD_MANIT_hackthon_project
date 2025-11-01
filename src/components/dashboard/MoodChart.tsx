
"use client"

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useChat } from "@/context/ChatProvider";
import type { ChatMessage } from "@/lib/types";

const chartConfig = {
  score: {
    label: "Mood Score",
    color: "hsl(var(--accent))",
  },
} as const;

// Helper to process messages and calculate daily average mood scores
const calculateMoodScores = (messages: ChatMessage[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => startOfDay(subDays(new Date(), i)));
    const dailyScores: { [key: string]: { total: number; count: number } } = {};

    messages.forEach(message => {
        if (message.sentiment) {
            const messageDate = startOfDay(message.timestamp);
            last7Days.forEach(day => {
                if (isSameDay(messageDate, day)) {
                    const dayString = format(day, 'yyyy-MM-dd');
                    if (!dailyScores[dayString]) {
                        dailyScores[dayString] = { total: 0, count: 0 };
                    }
                    // Convert sentiment score from [-1, 1] to [0, 10]
                    const moodScore = (message.sentiment.score + 1) * 5;
                    dailyScores[dayString].total += moodScore;
                    dailyScores[dayString].count++;
                }
            });
        }
    });

    return last7Days.reverse().map(day => {
        const dayString = format(day, 'yyyy-MM-dd');
        const data = dailyScores[dayString];
        return {
            day: format(day, 'E'),
            score: data ? data.total / data.count : 0,
        };
    });
};

export default function MoodChart() {
  const { messages } = useChat();
  const chartData = useMemo(() => calculateMoodScores(messages), [messages]);
  const hasData = useMemo(() => chartData.some(d => d.score > 0), [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Mood</CardTitle>
        <CardDescription>Your average mood scores over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0}}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis domain={[0, 10]} tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="score" fill="var(--color-score)" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-64 items-center justify-center text-center text-muted-foreground">
            <div>
              <p>No mood data available yet.</p>
              <p className="text-sm">Start a chat to see your mood trends here.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

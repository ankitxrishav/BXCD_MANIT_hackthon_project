
"use client"

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format, subDays, startOfDay } from 'date-fns';
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
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collectionGroup, query, where, orderBy, Timestamp } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";
import type { ChatMessage } from "@/lib/types";

const chartConfig = {
  score: {
    label: "Mood Score",
    color: "hsl(var(--accent))",
  },
} as const;

interface MoodChartProps {
  userId: string;
}

export default function MoodChart({ userId }: MoodChartProps) {
  const { firestore } = useFirebase();
  
  const sevenDaysAgo = useMemo(() => startOfDay(subDays(new Date(), 6)), []);

  const sentimentQuery = useMemoFirebase(() => {
    if (!userId || !firestore) {
      return null;
    }
    return query(
      collectionGroup(firestore, 'chatMessages'),
      where('userId', '==', userId),
      where('sentiment', '!=', null),
      where('timestamp', '>=', Timestamp.fromDate(sevenDaysAgo)),
      orderBy('timestamp', 'desc')
    );
  }, [userId, firestore, sevenDaysAgo]);

  const { data: sentimentData, isLoading } = useCollection<ChatMessage>(sentimentQuery);

  const chartData = useMemo(() => {
    const dailyScores: { [key: string]: { totalScore: number; count: number } } = {};
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), i);
        return format(d, 'E');
    }).reverse();

    // Initialize all days to ensure the chart shows 7 days
    daysOfWeek.forEach(day => {
        dailyScores[day] = { totalScore: 0, count: 0 };
    });

    sentimentData?.forEach((entry: any) => {
      if (entry.sentiment && entry.timestamp) {
        const date = entry.timestamp.toDate();
        const day = format(date, 'E'); 
        // Scale from -1..1 to 0..10 for chart readability
        const score = (entry.sentiment.score + 1) * 5; 

        if (dailyScores[day]) {
            dailyScores[day].totalScore += score;
            dailyScores[day].count += 1;
        }
      }
    });
    
    return daysOfWeek.map(day => {
        const data = dailyScores[day];
        return {
            day,
            score: data && data.count > 0 ? Math.round(data.totalScore / data.count) : 0,
        };
    });

  }, [sentimentData]);

  const hasData = useMemo(() => chartData.some(d => d.score > 0), [chartData]);
  
  if (isLoading) {
      return (
          <Card>
              <CardHeader>
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                  <Skeleton className="h-64 w-full" />
              </CardContent>
          </Card>
      )
  }

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

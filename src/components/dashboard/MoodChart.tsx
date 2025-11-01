
"use client"

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format, subDays } from 'date-fns';
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
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/lib/firebase/hooks/useCollection";
import { collectionGroup, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  score: {
    label: "Mood Score",
    color: "hsl(var(--accent))",
  },
} as const;

export default function MoodChart() {
  const { user } = useAuth();
  const sevenDaysAgo = useMemo(() => subDays(new Date(), 7), []);

  const sentimentQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collectionGroup(db, 'chatMessages'),
      where('sentiment', '!=', null),
      where('timestamp', '>=', Timestamp.fromDate(sevenDaysAgo)),
      orderBy('timestamp', 'desc')
    );
  }, [user, sevenDaysAgo]);

  const { data: sentimentData, loading } = useCollection(sentimentQuery);

  const chartData = useMemo(() => {
    const dailyScores: { [key: string]: { totalScore: number; count: number } } = {};

    sentimentData?.forEach((entry: any) => {
      if (entry.sentiment && entry.timestamp) {
        const date = entry.timestamp.toDate();
        const day = format(date, 'E'); // 'Mon', 'Tue', etc.
        const score = (entry.sentiment.score + 1) * 5; // Scale from -1..1 to 0..10

        if (!dailyScores[day]) {
          dailyScores[day] = { totalScore: 0, count: 0 };
        }
        dailyScores[day].totalScore += score;
        dailyScores[day].count += 1;
      }
    });

    const daysOfWeek = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'E')).reverse();
    
    return daysOfWeek.map(day => {
        const data = dailyScores[day];
        return {
            day,
            score: data ? Math.round(data.totalScore / data.count) : 0,
        };
    });

  }, [sentimentData]);
  
  if (loading) {
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
      </CardContent>
    </Card>
  )
}

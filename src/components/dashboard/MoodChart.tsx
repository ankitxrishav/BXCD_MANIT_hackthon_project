
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

const chartConfig = {
  score: {
    label: "Mood Score",
    color: "hsl(var(--accent))",
  },
} as const;


// Mock data for the mood chart
const generateMockData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        data.push({
            day: format(date, 'E'),
            score: Math.floor(Math.random() * 8) + 2, // Random score between 2 and 9
        });
    }
    return data;
}


export default function MoodChart() {
  const chartData = useMemo(() => generateMockData(), []);
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

'use client';
import { useChat } from '@/context/ChatProvider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useMemo } from 'react';

const chartConfig = {
  score: {
    label: 'Mood Score',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function MoodHistory() {
  const { moodScores } = useChat();

  const chartData = useMemo(() => {
    if (!moodScores || moodScores.length === 0) {
      return [];
    }
    // Aggregate scores by date (e.g., average score per day)
    const dailyScores = moodScores.reduce(
      (acc, score) => {
        const date = new Date(score.date).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { scores: [], count: 0 };
        }
        acc[date].scores.push(score.score);
        acc[date].count++;
        return acc;
      },
      {} as Record<string, { scores: number[]; count: number }>
    );

    return Object.entries(dailyScores)
      .map(([date, data]) => ({
        date,
        score: data.scores.reduce((a, b) => a + b, 0) / data.count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // show last 30 entries
  }, [moodScores]);

  return (
    <Card className="h-full transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <CardTitle>Mood Timeline</CardTitle>
        <CardDescription>
          A visual history of your mood scores over recent conversations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-score)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-score)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}
              />
              <YAxis
                domain={[-1, 1]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="score"
                type="natural"
                fill="url(#fillScore)"
                fillOpacity={0.4}
                stroke="var(--color-score)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-64 items-center justify-center text-center text-muted-foreground">
            <div>
              <p>No mood history yet.</p>
              <p className="text-sm">Your timeline will appear here as you chat.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

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
import type { MoodScore } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};


const chartConfig = {
  score: {
    label: 'Mood Score',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const toDate = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
  }
  // Handle cases where it might already be a Date object or ISO string
  if (timestamp.seconds) { // A plain object from Firestore offline cache
    return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
  }
  return new Date(timestamp);
}

export default function MoodHistory() {
  const { moodScores } = useChat();

  const chartData = useMemo(() => {
    if (!moodScores || moodScores.length === 0) {
      return [];
    }
    
    // Sort scores by date first
    const sortedScores = [...moodScores].sort((a, b) => 
        toDate(a.timestamp).getTime() - toDate(b.timestamp).getTime()
    );

    // Aggregate scores by date (e.g., average score per day)
    const dailyScores = sortedScores.reduce(
      (acc, scoreItem) => {
        const dateStr = toDate(scoreItem.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!acc[dateStr]) {
          acc[dateStr] = { scores: [], count: 0 };
        }
        acc[dateStr].scores.push(scoreItem.score);
        acc[dateStr].count++;
        return acc;
      },
      {} as Record<string, { scores: number[]; count: number }>
    );

    return Object.entries(dailyScores)
      .map(([date, data]) => ({
        date,
        score: data.scores.reduce((a, b) => a + b, 0) / data.count,
      }))
      .slice(-30); // show last 30 entries
  }, [moodScores]);

  return (
    <motion.div variants={itemVariants} className="h-full">
        <Card className="h-full glass-card transform-gpu transition-transform duration-300 hover:-translate-y-1">
        <CardHeader>
            <CardTitle>Mood Timeline</CardTitle>
            <CardDescription>
            A visual history of your mood scores over recent conversations.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {chartData.length > 1 ? (
            <ChartContainer config={chartConfig} className="h-64 w-full">
                <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-score)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-score)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    
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
                <p>Not enough mood history yet.</p>
                <p className="text-sm">Your timeline will appear here as you have more conversations.</p>
                </div>
            </div>
            )}
        </CardContent>
        </Card>
    </motion.div>
  );
}

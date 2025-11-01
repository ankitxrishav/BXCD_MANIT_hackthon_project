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
  if (!timestamp) {
    return new Date(NaN); // Return an invalid date
  }
  if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
  }
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
    
    const validScores = [...moodScores]
        .filter(item => item && item.timestamp && !isNaN(toDate(item.timestamp).getTime()))
        .map(item => ({...item, dateObj: toDate(item.timestamp)}));


    const dailyScores = validScores.reduce(
      (acc, scoreItem) => {
        const dateStr = scoreItem.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!acc[dateStr]) {
          acc[dateStr] = { scores: [], count: 0, date: scoreItem.dateObj };
        }
        acc[dateStr].scores.push(scoreItem.score);
        acc[dateStr].count++;
        return acc;
      },
      {} as Record<string, { scores: number[]; count: number, date: Date }>
    );

    return Object.entries(dailyScores)
      .map(([dateStr, data]) => ({
        date: dateStr,
        score: data.scores.reduce((a, b) => a + b, 0) / data.count,
        sortDate: data.date,
      }))
      .sort((a,b) => a.sortDate.getTime() - b.sortDate.getTime())
      .slice(-30); 
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
                    width={30}
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

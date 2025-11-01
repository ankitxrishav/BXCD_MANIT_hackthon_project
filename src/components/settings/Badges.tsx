
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth.tsx';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Badge as BadgeType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Badge from './Badge';

export default function Badges() {
  const { userProfile } = useAuth();
  const firestore = useFirestore();

  const badgesQuery = useMemoFirebase(() => {
    if (!userProfile?.uid || !firestore) return null;
    return collection(firestore, 'users', userProfile.uid, 'badges');
  }, [userProfile, firestore]);

  const { data: userBadges, isLoading } = useCollection<BadgeType>(badgesQuery);

  const allBadges: BadgeType[] = [
    { id: 'first-chat', name: 'First Chat', description: 'Completed your first chat session.', icon: 'MessageCircle', achieved: false },
    { id: 'positive-vibe', name: 'Positive Vibe', description: 'First positive mood detected.', icon: 'Smile', achieved: false },
    { id: 'deep-thinker', name: 'Deep Thinker', description: 'Had a conversation with over 20 messages.', icon: 'BrainCircuit', achieved: false },
    { id: 'week-streak', name: 'Week Streak', description: 'Used the app every day for a week.', icon: 'Flame', achieved: false },
    { id: 'explorer', name: 'Explorer', description: 'Used a suggested topic from the AI.', icon: 'Compass', achieved: false },
    { id: 'voice-note', name: 'Voice Note', description: 'Used the voice transcription feature.', icon: 'Mic', achieved: false },
  ];

  const badges = allBadges.map(b => {
    const userBadge = userBadges?.find(ub => ub.id === b.id);
    return userBadge ? { ...b, achieved: true } : b;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewards</CardTitle>
        <CardDescription>Collect badges as you continue your wellness journey.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {badges.map(badge => (
              <Badge key={badge.id} badge={badge} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

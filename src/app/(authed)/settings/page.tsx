

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/use-auth.tsx';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Badges from '@/components/settings/Badges';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useUser } from '@/firebase';

export default function SettingsPage() {
  const { userProfile, logout } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();

  const [enableSentimentAnalysis, setEnableSentimentAnalysis] = useState(
    userProfile?.settings?.enableSentimentAnalysis ?? true
  );
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState(
    userProfile?.settings?.dataRetentionPeriod ?? '90d'
  );
    
  const userInitial = userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || 'U';
  const memberSince = user?.metadata.creationTime ? format(new Date(user.metadata.creationTime), "MMMM yyyy") : null;


  useEffect(() => {
    if (userProfile) {
      setEnableSentimentAnalysis(userProfile.settings?.enableSentimentAnalysis ?? true);
      setDataRetentionPeriod(userProfile.settings?.dataRetentionPeriod ?? '90d');
    }
  }, [userProfile]);

  const handleSaveChanges = () => {
    // In a real app, you would save these to a database
    console.log({ enableSentimentAnalysis, dataRetentionPeriod });
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated.',
    });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would trigger a process to delete all user data
    console.log('Deleting account...');
    toast({
      variant: 'destructive',
      title: 'Account Deletion Initiated',
      description: 'Your account and data will be permanently deleted.',
    });
    // For mock purposes, just log out
    logout();
  };
  
  if (!userProfile) {
      return (
          <div className="max-w-4xl mx-auto space-y-8">
              <Skeleton className="h-10 w-1/4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Skeleton className="h-96 md:col-span-1" />
                  <div className="md:col-span-2 space-y-8">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Profile</h1>
        <p className="text-muted-foreground">Manage your profile, preferences and rewards.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardContent className="p-6 text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-background ring-2 ring-primary/50">
                        <AvatarImage src={userProfile.photoURL ?? undefined} alt={userProfile.displayName ?? 'user'}/>
                        <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl">{userProfile.displayName}</CardTitle>
                    <CardDescription>{userProfile.email}</CardDescription>
                    {memberSince && <CardDescription className="mt-2">Member since {memberSince}</CardDescription>}
                </CardContent>
            </Card>
            <Badges />
        </div>

        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your Emodash experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                    <Label htmlFor="sentiment-analysis" className="flex flex-col space-y-1">
                    <span>Sentiment Analysis</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Enable AI-powered analysis of your mood from chat entries.
                    </span>
                    </Label>
                    <Switch
                    id="sentiment-analysis"
                    checked={enableSentimentAnalysis}
                    onCheckedChange={setEnableSentimentAnalysis}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="data-retention">Data Retention</Label>
                    <Select value={dataRetentionPeriod} onValueChange={setDataRetentionPeriod}>
                    <SelectTrigger id="data-retention">
                        <SelectValue placeholder="Select a period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="30d">30 days</SelectItem>
                        <SelectItem value="90d">90 days</SelectItem>
                        <SelectItem value="1y">1 year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                    Choose how long to keep your chat history.
                    </p>
                </div>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <Button variant="outline">Export My Data</Button>
                    <p className="text-sm text-muted-foreground mt-2">Download all your data in a JSON format.</p>
                </div>
                <div>
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete My Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove all your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount}>
                            Continue
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                    <p className="text-sm text-muted-foreground mt-2">Permanently delete your account and all associated data.</p>
                </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

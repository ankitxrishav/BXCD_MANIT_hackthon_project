
'use client';

import { useState, useRef } from 'react';
import { Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transcribeVoiceToText } from '@/ai/flows/transcribe-voice-to-text';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function VoiceRecorder({ onTranscription }: { onTranscription: (text: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = handleStop;
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        variant: 'destructive',
        title: 'Microphone access denied',
        description: 'Please allow microphone access in your browser settings to use voice recording.',
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };
  
  const handleStop = async () => {
      setIsRecording(false);
      setIsProcessing(true);
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

      if (audioBlob.size === 0) {
        setIsProcessing(false);
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          const { transcription } = await transcribeVoiceToText({ audioDataUri: base64data });
          onTranscription(transcription);
        } catch (error) {
          console.error('Error transcribing audio:', error);
          toast({
            variant: 'destructive',
            title: 'Transcription Failed',
            description: 'Could not transcribe the audio. Please try again.',
          });
        } finally {
            setIsProcessing(false);
        }
      };
  }

  return (
    <Button 
        onClick={isRecording ? handleStopRecording : handleStartRecording} 
        variant={isRecording ? 'destructive' : 'outline'}
        size="icon"
        disabled={isProcessing}
    >
        {isRecording ? <StopCircle className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
        <span className="sr-only">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
    </Button>
  );
}

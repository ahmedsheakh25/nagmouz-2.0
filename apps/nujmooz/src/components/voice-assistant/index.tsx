import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@nagmouz/ui';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, StopCircle, Play, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  audioUrl?: string;
}

export function VoiceAssistant() {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(() => uuidv4());
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const setupRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          audioChunks.current = [];
          await processAudio(audioBlob);
        };
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    };

    setupRecorder();
  }, [user]);

  const startRecording = () => {
    if (mediaRecorder.current?.state === 'inactive') {
      mediaRecorder.current?.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current?.stop();
      setRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      setProcessing(true);

      // Transcribe audio
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!transcribeResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const { text } = await transcribeResponse.json();

      // Add user message
      const userMessage: Message = {
        id: uuidv4(),
        content: text,
        role: 'user',
      };
      setMessages(prev => [...prev, userMessage]);

      // Get chat response
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          sessionId,
          userId: user?.id,
        }),
      });

      if (!chatResponse.ok) {
        throw new Error('Failed to get chat response');
      }

      const { response } = await chatResponse.json();

      // Convert response to speech
      const speechResponse = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: response }),
      });

      if (!speechResponse.ok) {
        throw new Error('Failed to generate speech');
      }

      const { audio } = await speechResponse.json();
      const audioUrl = `data:audio/mp3;base64,${audio}`;

      // Add assistant message
      const assistantMessage: Message = {
        id: uuidv4(),
        content: response,
        role: 'assistant',
        audioUrl,
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Play audio response
      const audioElement = new Audio(audioUrl);
      await audioElement.play();
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setProcessing(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`p-4 ${
              message.role === 'user' ? 'bg-primary/10' : 'bg-secondary/10'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">
                  {message.role === 'user' ? 'You' : 'Nujmooz'}
                </p>
                <p className="text-sm">{message.content}</p>
              </div>
              {message.audioUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => playAudio(message.audioUrl!)}
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-center">
          <Button
            size="lg"
            variant={recording ? 'destructive' : 'default'}
            onClick={recording ? stopRecording : startRecording}
            disabled={processing}
          >
            {processing ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : recording ? (
              <StopCircle className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
            <span className="ml-2">
              {processing
                ? 'Processing...'
                : recording
                ? 'Stop Recording'
                : 'Start Recording'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
} 
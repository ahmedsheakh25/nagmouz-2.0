import { useState } from 'react';
import { ChatMessages } from './chat-messages';
import { VoiceRecorder } from './voice-recorder';
import { Message } from '@/types';

export function VoiceAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = async () => {
    setIsRecording(true);
    // TODO: Implement recording logic
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    // TODO: Implement stop recording and send to Whisper
  };

  const handleMessageReceived = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    // TODO: Implement text-to-speech with ElevenLabs
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessages messages={messages} />
      </div>
      <div className="border-t bg-background p-4">
        <VoiceRecorder
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
        />
      </div>
    </div>
  );
} 
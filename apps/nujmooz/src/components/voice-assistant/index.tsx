import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessages } from './chat-messages';
import { VoiceRecorder } from './voice-recorder';
import { Message } from '@/types';
import { VoiceService } from '@/lib/voice';
import { ChatService } from '@/lib/chat';
import { addMessage, createChatSession, getSessionMessages } from '@/lib/supabase';

export function VoiceAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [voiceService] = useState(() => new VoiceService());
  const [chatService] = useState(() => new ChatService());

  useEffect(() => {
    const initSession = async () => {
      // TODO: Get actual user ID from auth
      const userId = 'test-user';
      const session = await createChatSession(userId, 'brief_builder');
      setSessionId(session.id);

      const existingMessages = await getSessionMessages(session.id);
      setMessages(existingMessages);
    };

    initSession();
  }, []);

  const handleStartRecording = async () => {
    try {
      setIsRecording(true);
      await voiceService.startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      const audioBlob = await voiceService.stopRecording();
      const transcription = await voiceService.transcribeAudio(audioBlob);

      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content: transcription,
        createdAt: new Date(),
      };

      // Save user message to Supabase
      await addMessage(sessionId, userMessage.role, userMessage.content);
      setMessages(prev => [...prev, userMessage]);

      // Get AI response
      const response = await chatService.getResponse([...messages, userMessage]);
      const audioBuffer = await voiceService.generateSpeech(response);
      const audioUrl = URL.createObjectURL(new Blob([audioBuffer], { type: 'audio/mpeg' }));

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        audioUrl,
        createdAt: new Date(),
      };

      // Save assistant message to Supabase
      await addMessage(sessionId, assistantMessage.role, assistantMessage.content, assistantMessage.audioUrl);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to process recording:', error);
    }
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
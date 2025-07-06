"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Card, useAuth } from "@nagmouz/ui";
import { Mic, StopCircle, Play, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  audioUrl?: string;
}

export function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(() => uuidv4());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { user } = useAuth();

  const processAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
          const transcriptResponse = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!transcriptResponse.ok) {
            throw new Error("Failed to transcribe audio");
          }

          const { text } = await transcriptResponse.json();
          setTranscript(text);

          const chatResponse = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: text }),
          });

          if (!chatResponse.ok) {
            throw new Error("Failed to get chat response");
          }

          const { message } = await chatResponse.json();
          setResponse(message);

          const audioResponse = await fetch("/api/text-to-speech", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: message }),
          });

          if (!audioResponse.ok) {
            throw new Error("Failed to convert text to speech");
          }

          const audioBlob = await audioResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
        } catch (error) {
          console.error("Error processing audio:", error);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (isRecording) {
      processAudio();
    }
  }, [isRecording]);

  if (!user) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-center">
          <Button
            onClick={() => setIsRecording(!isRecording)}
            variant={isRecording ? "destructive" : "default"}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
        </div>
        {transcript && (
          <div className="space-y-2">
            <h3 className="font-semibold">You said:</h3>
            <p>{transcript}</p>
          </div>
        )}
        {response && (
          <div className="space-y-2">
            <h3 className="font-semibold">Assistant response:</h3>
            <p>{response}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

import { cn } from "@nagmouz/ui";
import { Mic, MicOff } from "lucide-react";

interface VoiceRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function VoiceRecorder({
  isRecording,
  onStartRecording,
  onStopRecording,
}: VoiceRecorderProps) {
  return (
    <div className="flex justify-center">
      <button
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={cn(
          "rounded-full p-4 transition-colors",
          isRecording
            ? "bg-destructive text-destructive-foreground animate-pulse"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        {isRecording ? (
          <MicOff className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}

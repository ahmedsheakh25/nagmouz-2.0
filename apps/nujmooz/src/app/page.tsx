import { VoiceAssistant } from "@/components/voice-assistant";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex w-full flex-1 flex-col">
        <VoiceAssistant />
      </div>
    </main>
  );
}

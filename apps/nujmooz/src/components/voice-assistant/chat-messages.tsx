import { Message } from "@/types";
import { cn } from "@nagmouz/ui";

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex w-full",
            message.role === "user" ? "justify-end" : "justify-start",
          )}
        >
          <div
            className={cn(
              "rounded-lg px-4 py-2 max-w-[80%]",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted",
            )}
          >
            <p className="text-sm">{message.content}</p>
            {message.audioUrl && (
              <audio
                className="mt-2"
                controls
                src={message.audioUrl}
                preload="none"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

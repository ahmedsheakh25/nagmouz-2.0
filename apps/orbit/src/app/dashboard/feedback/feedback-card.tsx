import { Card } from '@nagmouz/ui';
import { Star } from 'lucide-react';

interface Feedback {
  id: string;
  sessionId: string;
  rating: number;
  comment: string;
  userName: string;
  userCompany: string;
  createdAt: string;
}

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < feedback.rating ? 'fill-yellow-400' : 'fill-gray-200'
              }`}
            />
          ))}
        </div>

        <blockquote className="text-sm italic">"{feedback.comment}"</blockquote>

        <div>
          <div className="font-medium">{feedback.userName}</div>
          <div className="text-sm text-muted-foreground">
            {feedback.userCompany}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Submitted on {feedback.createdAt}
        </div>
      </div>
    </Card>
  );
} 
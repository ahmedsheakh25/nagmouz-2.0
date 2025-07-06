import { DashboardLayout } from '@/components/layout/dashboard';
import { FeedbackCard } from './feedback-card';

const feedback = [
  {
    id: '1',
    sessionId: 'session-1',
    rating: 5,
    comment: 'The AI assistant was incredibly helpful in understanding our brand needs. The questions were relevant and the brief generated was spot on.',
    userName: 'Ahmed Al-Sayed',
    userCompany: 'TechCo',
    createdAt: '2024-03-14',
  },
  {
    id: '2',
    sessionId: 'session-2',
    rating: 4,
    comment: 'Great experience overall. The voice interaction made it feel very natural. Would love to see more design-specific questions.',
    userName: 'Sara Al-Rashid',
    userCompany: 'Fashion House',
    createdAt: '2024-03-13',
  },
  {
    id: '3',
    sessionId: 'session-3',
    rating: 5,
    comment: 'The Arabic language support is excellent. The assistant understood our local context perfectly.',
    userName: 'Mohammed Al-Qasim',
    userCompany: 'Food & Co',
    createdAt: '2024-03-12',
  },
];

export default function FeedbackPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Client Feedback</h2>
          <p className="text-muted-foreground">
            Review feedback from client interactions with Nujmooz
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {feedback.map((item) => (
            <FeedbackCard key={item.id} feedback={item} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 
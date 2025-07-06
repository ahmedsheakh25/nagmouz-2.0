import { DashboardLayout } from '@/components/layout/dashboard';
import { BriefCard } from './brief-card';

const briefs = [
  {
    id: '1',
    projectTitle: 'Brand Refresh - Tech Startup',
    clientName: 'TechCo',
    submittedAt: '2024-03-10',
    status: 'pending_review',
    summary: 'Modern tech brand identity with focus on innovation and trust.',
  },
  {
    id: '2',
    projectTitle: 'E-commerce Website',
    clientName: 'Fashion House',
    submittedAt: '2024-03-12',
    status: 'approved',
    summary: 'Luxury fashion e-commerce platform with AR try-on features.',
  },
  {
    id: '3',
    projectTitle: 'Social Media Campaign',
    clientName: 'Food & Co',
    submittedAt: '2024-03-14',
    status: 'in_progress',
    summary: 'Instagram and TikTok campaign for new restaurant launch.',
  },
];

export default function BriefsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Creative Briefs</h2>
          <p className="text-muted-foreground">
            Review and manage project briefs from clients
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {briefs.map((brief) => (
            <BriefCard key={brief.id} brief={brief} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 
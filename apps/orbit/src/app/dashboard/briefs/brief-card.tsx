import { Card } from '@nagmouz/ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Send } from 'lucide-react';

interface Brief {
  id: string;
  projectTitle: string;
  clientName: string;
  submittedAt: string;
  status: string;
  summary: string;
}

interface BriefCardProps {
  brief: Brief;
}

const statusColors = {
  pending_review: 'bg-yellow-500',
  approved: 'bg-green-500',
  in_progress: 'bg-blue-500',
  rejected: 'bg-red-500',
};

export function BriefCard({ brief }: BriefCardProps) {
  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{brief.projectTitle}</h3>
            <p className="text-sm text-muted-foreground">{brief.clientName}</p>
          </div>
          <Badge
            variant="secondary"
            className={statusColors[brief.status as keyof typeof statusColors]}
          >
            {brief.status}
          </Badge>
        </div>

        <p className="text-sm">{brief.summary}</p>

        <div className="text-sm text-muted-foreground">
          Submitted on {brief.submittedAt}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send to Trello
          </Button>
        </div>
      </div>
    </Card>
  );
} 
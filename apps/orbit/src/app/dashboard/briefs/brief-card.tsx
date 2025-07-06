import { Card } from '@nagmouz/ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface Brief {
  id: string;
  projectTitle: string;
  clientName: string;
  submittedAt: string;
  status: string;
  summary: string;
  client: {
    name: string;
    email: string;
    company: string;
  };
  answers: Record<string, string>;
  createdAt: string;
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
  const [loading, setLoading] = useState(false);
  const [sendingToTrello, setSendingToTrello] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: brief.projectTitle,
          answers: brief.answers,
          clientInfo: brief.client,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const { url } = await response.json();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendToTrello = async () => {
    try {
      setSendingToTrello(true);
      const response = await fetch('/api/send-to-trello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: brief.projectTitle,
          answers: brief.answers,
          clientInfo: brief.client,
        }),
      });

      if (!response.ok) throw new Error('Failed to create Trello card');

      const { cardUrl } = await response.json();
      toast({
        title: 'Success',
        description: 'Brief sent to Trello successfully!',
      });
      window.open(cardUrl, '_blank');
    } catch (error) {
      console.error('Error sending to Trello:', error);
      toast({
        title: 'Error',
        description: 'Failed to send to Trello. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSendingToTrello(false);
    }
  };

  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{brief.projectTitle}</h3>
            <p className="text-sm text-muted-foreground">{brief.client.company}</p>
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            disabled={loading}
          >
            {loading ? 'Generating...' : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendToTrello}
            disabled={sendingToTrello}
          >
            {sendingToTrello ? 'Sending...' : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send to Trello
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
} 
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Brief } from '@/types/briefs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BriefsTableProps {
  briefs: Brief[];
}

export function BriefsTable({ briefs }: BriefsTableProps) {
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {briefs.map((brief) => (
              <TableRow key={brief.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{brief.user_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {brief.user_email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{brief.service_type}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(brief.status)}>
                    {brief.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(brief.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => setSelectedBrief(brief)}
                    className="text-sm text-primary hover:underline"
                  >
                    View Details
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedBrief} onOpenChange={() => setSelectedBrief(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Brief Details</DialogTitle>
          </DialogHeader>
          {selectedBrief && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm">Client</h4>
                  <p>{selectedBrief.user_name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Email</h4>
                  <p>{selectedBrief.user_email}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Service Type</h4>
                  <p>{selectedBrief.service_type}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Status</h4>
                  <p>{selectedBrief.status}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Details</h4>
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <pre className="text-sm">
                    {JSON.stringify(selectedBrief.details, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'secondary';
    case 'draft':
      return 'outline';
    default:
      return 'default';
  }
} 
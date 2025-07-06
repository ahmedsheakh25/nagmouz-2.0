import { Card } from '@nagmouz/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const projects = [
  {
    id: '1',
    title: 'Brand Refresh - Tech Startup',
    type: 'branding',
    status: 'in_progress',
    client: 'TechCo',
    deadline: '2024-03-15',
  },
  {
    id: '2',
    title: 'E-commerce Website',
    type: 'web_design',
    status: 'review',
    client: 'Fashion House',
    deadline: '2024-03-20',
  },
  {
    id: '3',
    title: 'Social Media Campaign',
    type: 'marketing',
    status: 'draft',
    client: 'Food & Co',
    deadline: '2024-03-25',
  },
];

const statusColors = {
  draft: 'bg-gray-500',
  in_progress: 'bg-blue-500',
  review: 'bg-yellow-500',
  completed: 'bg-green-500',
  archived: 'bg-gray-700',
};

export function ProjectsTable() {
  return (
    <Card>
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell className="capitalize">{project.type}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[project.status as keyof typeof statusColors]}
                  >
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>{project.deadline}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
} 
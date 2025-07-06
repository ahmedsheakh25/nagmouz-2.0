import { DashboardLayout } from '@/components/layout/dashboard';
import { ProjectsTable } from './projects-table';

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage and track all creative projects
          </p>
        </div>

        <ProjectsTable />
      </div>
    </DashboardLayout>
  );
} 
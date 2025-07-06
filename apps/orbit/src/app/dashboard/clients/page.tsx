import { DashboardLayout } from '@/components/layout/dashboard';
import { ClientsTable } from './clients-table';

export default function ClientsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">
            Manage client relationships and projects
          </p>
        </div>

        <ClientsTable />
      </div>
    </DashboardLayout>
  );
} 
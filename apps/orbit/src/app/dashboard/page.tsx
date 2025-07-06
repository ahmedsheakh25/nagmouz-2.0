import { DashboardLayout } from '@/components/layout/dashboard';
import { Card } from '@nagmouz/ui';
import {
  BarChart,
  FileText,
  Users,
  TrendingUp,
} from 'lucide-react';

const stats = [
  {
    name: 'Total Projects',
    value: '45',
    change: '+12.3%',
    icon: FileText,
  },
  {
    name: 'Active Users',
    value: '2.7k',
    change: '+5.4%',
    icon: Users,
  },
  {
    name: 'Conversion Rate',
    value: '24.8%',
    change: '+2.1%',
    icon: TrendingUp,
  },
  {
    name: 'Revenue',
    value: '$45.2k',
    change: '+8.7%',
    icon: BarChart,
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your creative studio's performance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <span className="text-sm font-medium text-green-600">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* TODO: Add charts and recent activity */}
      </div>
    </DashboardLayout>
  );
} 
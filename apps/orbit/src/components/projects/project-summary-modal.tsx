import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectSummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    title: string;
    status: string;
    progress: number;
    startDate: string;
    endDate: string;
    client: {
      name: string;
      company: string;
    };
    team: Array<{
      name: string;
      role: string;
    }>;
    milestones: Array<{
      title: string;
      status: string;
      dueDate: string;
    }>;
    budget: {
      total: number;
      spent: number;
      currency: string;
    };
  };
}

export function ProjectSummaryModal({
  open,
  onOpenChange,
  project,
}: ProjectSummaryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Project Summary</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6 p-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{project.title}</h2>
                <p className="text-muted-foreground">
                  {project.client.company}
                </p>
              </div>
              <Badge>{project.status}</Badge>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} />
            </div>

            {/* Timeline */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Timeline</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p>{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p>{new Date(project.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>

            {/* Team */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Team</h3>
              <div className="space-y-2">
                {project.team.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{member.name}</span>
                    <Badge variant="outline">{member.role}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Milestones */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Milestones</h3>
              <div className="space-y-3">
                {project.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{milestone.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">{milestone.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Budget */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Budget</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Budget</span>
                  <span>
                    {project.budget.currency}{" "}
                    {project.budget.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Spent</span>
                  <span>
                    {project.budget.currency}{" "}
                    {project.budget.spent.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Remaining</span>
                  <span>
                    {project.budget.currency}{" "}
                    {(
                      project.budget.total - project.budget.spent
                    ).toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={(project.budget.spent / project.budget.total) * 100}
                  className="mt-2"
                />
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BriefsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Briefs</h2>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Project Briefs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              No briefs found. Project briefs will appear here once created.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
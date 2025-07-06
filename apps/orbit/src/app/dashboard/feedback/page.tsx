import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeedbackPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Feedback</h2>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Project Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              No feedback found. Client feedback will appear here once received.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

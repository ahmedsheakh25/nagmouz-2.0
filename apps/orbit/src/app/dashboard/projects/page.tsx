"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ProjectForm } from "@/components/project-form";
import { supabase } from "@/lib/supabaseClient";
import type { Project } from "@/lib/schemas/project";

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return;
    }

    setProjects(data || []);
    setIsLoading(false);
  }

  React.useEffect(() => {
    fetchProjects();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("projects_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function getStatusColor(status: string) {
    switch (status) {
      case "pending":
        return "default";
      case "in_progress":
        return "blue";
      case "completed":
        return "green";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>New Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <ProjectForm
              onSuccess={() => {
                setOpen(false);
                fetchProjects();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <div className="flex h-[450px] flex-col items-center justify-center space-y-4">
          <p className="text-lg text-muted-foreground">No projects found</p>
          <Button
            variant="outline"
            onClick={() => setOpen(true)}
          >
            Create your first project
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="capitalize">{project.type}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(project.status)}>
                      {project.status.split("_").map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(" ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(project.created_at), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 
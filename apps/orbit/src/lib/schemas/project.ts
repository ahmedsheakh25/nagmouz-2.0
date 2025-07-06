import * as z from "zod";

export const projectTypes = ["branding", "web", "mobile", "marketing"] as const;
export const projectStatuses = ["pending", "in_progress", "completed", "cancelled"] as const;

export const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  type: z.enum(projectTypes, {
    required_error: "Please select a project type",
  }),
  status: z.enum(projectStatuses, {
    required_error: "Please select a project status",
  }),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export interface Project extends ProjectFormValues {
  id: string;
  user_id: string;
  created_at: string;
} 
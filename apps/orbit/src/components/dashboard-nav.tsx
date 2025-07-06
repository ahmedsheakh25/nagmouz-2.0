import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Briefs",
    href: "/dashboard/briefs",
    icon: FileText,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: "FolderKanban",
  },
  {
    title: "Clients",
    href: "/dashboard/clients",
    icon: "Users",
  },
  {
    title: "Feedback",
    href: "/dashboard/feedback",
    icon: "MessageSquare",
  },
];

interface DashboardNavProps {
  className?: string;
}

export function DashboardNav({ className }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("grid items-start gap-2", className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Link key={index} href={item.href}>
            <span
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent" : "transparent"
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

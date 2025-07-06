import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

const items: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
  },
  {
    title: "Briefs",
    href: "/dashboard/briefs",
  },
  {
    title: "Feedback",
    href: "/dashboard/feedback",
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

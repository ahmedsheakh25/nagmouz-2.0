import { Card } from "@nagmouz/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";

const clients = [
  {
    id: "1",
    name: "TechCo",
    contactName: "Ahmed Al-Sayed",
    email: "ahmed@techco.com",
    projectsCount: 3,
    totalSpent: "$45,000",
    lastActive: "2024-03-14",
  },
  {
    id: "2",
    name: "Fashion House",
    contactName: "Sara Al-Rashid",
    email: "sara@fashionhouse.com",
    projectsCount: 2,
    totalSpent: "$32,000",
    lastActive: "2024-03-13",
  },
  {
    id: "3",
    name: "Food & Co",
    contactName: "Mohammed Al-Qasim",
    email: "mohammed@foodco.com",
    projectsCount: 1,
    totalSpent: "$15,000",
    lastActive: "2024-03-12",
  },
];

export function ClientsTable() {
  return (
    <Card>
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {client.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{client.contactName}</TableCell>
                <TableCell>{client.projectsCount} projects</TableCell>
                <TableCell>{client.totalSpent}</TableCell>
                <TableCell>{client.lastActive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

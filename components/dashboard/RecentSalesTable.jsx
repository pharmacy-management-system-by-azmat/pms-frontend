"use client";

import { Ellipsis, Eye, ReceiptText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const recentSales = [
  {
    id: "#TXN-4821",
    customer: "Sarah Mitchell",
    payment: "Card",
    total: "PKR 86.50",
    status: "Completed",
  },
  {
    id: "#TXN-4820",
    customer: "James Wilson",
    payment: "Cash",
    total: "PKR 42.00",
    status: "Completed",
  },
  {
    id: "#TXN-4819",
    customer: "Olivia Carter",
    payment: "Online",
    total: "PKR 124.75",
    status: "Pending",
  },
  {
    id: "#TXN-4818",
    customer: "Michael Brown",
    payment: "Card",
    total: "PKR 59.20",
    status: "Completed",
  },
  {
    id: "#TXN-4817",
    customer: "Emma Davis",
    payment: "Cash",
    total: "PKR 37.90",
    status: "Completed",
  },
];

export default function RecentSalesTable() {
  return (
    <Card>
      <CardHeader className="sm:flex sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Recent sales</CardTitle>
          <CardDescription>
            The latest point-of-sale transactions.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 cursor-pointer sm:mt-0"
        >
          View all sales
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Patient / Customer</TableHead>
              <TableHead>Payment method</TableHead>
              <TableHead>Total amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium text-foreground">
                  {sale.id}
                </TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>
                  <Badge variant="outline">{sale.payment}</Badge>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {sale.total}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      sale.status === "Completed" ? "secondary" : "outline"
                    }
                    className={
                      sale.status === "Completed"
                        ? "text-primary"
                        : "text-accent-foreground"
                    }
                  >
                    {sale.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer"
                          aria-label={`Actions for ${sale.id}`}
                        />
                      }
                    >
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye />
                        View transaction
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ReceiptText />
                        Print receipt
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        Void transaction
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

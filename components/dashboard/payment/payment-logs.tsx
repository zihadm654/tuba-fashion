import { PaymentLog } from "@prisma/client";
import { format } from "date-fns";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PaymentLogsProps {
  payments: PaymentLog[];
}

export default function PaymentLogs({ payments }: PaymentLogsProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>
          Recent payment transactions and their status.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">Transaction ID</TableHead>
              <TableHead className="min-w-[200px]">Customer</TableHead>
              <TableHead className="min-w-[120px]">Payment Method</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[120px]">Date</TableHead>
              <TableHead className="min-w-[100px] text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="break-all">
                  {payment.transactionId}
                </TableCell>
                <TableCell>
                  <div className="max-w-[180px] truncate font-medium">
                    {payment.customerName}
                  </div>
                  <div className="text-muted-foreground max-w-[180px] truncate text-sm">
                    {payment.customerEmail}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {payment.paymentMethod || "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payment.status === "SUCCESS" ? "default" : "secondary"
                    }
                    className="text-xs whitespace-nowrap"
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  ৳{payment.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

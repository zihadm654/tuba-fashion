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

type PaymentLog = {
  id: string;
  transactionId: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELED";
  customerName: string;
  customerEmail: string;
  createdAt: Date;
  paymentMethod?: string;
};

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
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.transactionId}</TableCell>
                <TableCell>
                  <div className="font-medium">{payment.customerName}</div>
                  <div className="text-sm text-muted-foreground">
                    {payment.customerEmail}
                  </div>
                </TableCell>
                <TableCell>{payment.paymentMethod || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    variant={payment.status === "SUCCESS" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-right">
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
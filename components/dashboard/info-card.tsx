import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoCardProps {
  title: string;
  amount: number;
  growth: number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
export default function InfoCard({
  title,
  amount,
  growth,
  Icon,
}: InfoCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground size-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{amount}</div>
        <p className="text-muted-foreground text-xs">
          +{growth}% from last month
        </p>
      </CardContent>
    </Card>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { BarChart3, Users, DollarSign, Percent } from "lucide-react";

interface CampaignAnalyticsProps {
  campaignId: string;
  campaignName: string;
}

interface AnalyticsData {
  totalCodes: number;
  redeemedCodes: number;
  totalSales: number;
  redemptionRate: number;
}

export default function CampaignAnalytics({ campaignId, campaignName }: CampaignAnalyticsProps) {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: [`/api/campaigns/${campaignId}/analytics`],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Campaign Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const metrics = [
    {
      label: "Codes Generated",
      value: analytics.totalCodes,
      icon: Users,
      testId: "metric-codes-generated"
    },
    {
      label: "Codes Redeemed",
      value: analytics.redeemedCodes,
      icon: BarChart3,
      testId: "metric-codes-redeemed"
    },
    {
      label: "Total Sales",
      value: `₹${analytics.totalSales.toLocaleString()}`,
      icon: DollarSign,
      testId: "metric-total-sales"
    },
    {
      label: "Redemption Rate",
      value: `${analytics.redemptionRate}%`,
      icon: Percent,
      testId: "metric-redemption-rate"
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold" data-testid="text-analytics-title">
        Analytics: {campaignName}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{metric.label}</span>
              <metric.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold" data-testid={metric.testId}>
              {metric.value}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

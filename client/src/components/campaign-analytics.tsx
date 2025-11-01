import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, DollarSign, Percent, CheckCircle2, Clock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

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

interface Follower {
  name: string;
  whatsapp: string;
  couponCode: string;
  generatedAt: Date;
  redeemed: boolean;
  redeemedAt?: Date;
  purchaseAmount: number;
}

export default function CampaignAnalytics({ campaignId, campaignName }: CampaignAnalyticsProps) {
  const { toast } = useToast();

  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: [`/api/campaigns/${campaignId}/analytics`],
  });

  const { data: followers, isLoading: followersLoading } = useQuery<Follower[]>({
    queryKey: [`/api/campaigns/${campaignId}/followers`],
  });

  const handleCopyWhatsApp = async (whatsapp: string) => {
    await navigator.clipboard.writeText(whatsapp);
    toast({
      title: "Copied!",
      description: "WhatsApp number copied to clipboard",
    });
  };

  if (analyticsLoading || followersLoading) {
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

  if (!analytics || !followers) return null;

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

  const redeemedFollowers = followers.filter(f => f.redeemed);
  const pendingFollowers = followers.filter(f => !f.redeemed);

  return (
    <div className="space-y-6">
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

      <Card>
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b px-6 pt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All Followers ({followers.length})
              </TabsTrigger>
              <TabsTrigger value="redeemed">
                Redeemed ({redeemedFollowers.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingFollowers.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-6 pt-4">
            <FollowerTable followers={followers} onCopyWhatsApp={handleCopyWhatsApp} />
          </TabsContent>

          <TabsContent value="redeemed" className="p-6 pt-4">
            <FollowerTable followers={redeemedFollowers} onCopyWhatsApp={handleCopyWhatsApp} />
          </TabsContent>

          <TabsContent value="pending" className="p-6 pt-4">
            <FollowerTable followers={pendingFollowers} onCopyWhatsApp={handleCopyWhatsApp} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

function FollowerTable({ followers, onCopyWhatsApp }: { followers: Follower[]; onCopyWhatsApp: (whatsapp: string) => void }) {
  if (followers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No followers in this category
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-medium">Follower</th>
            <th className="text-left px-4 py-3 text-sm font-medium">WhatsApp</th>
            <th className="text-left px-4 py-3 text-sm font-medium">Coupon Code</th>
            <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
            <th className="text-right px-4 py-3 text-sm font-medium">Amount</th>
            <th className="text-left px-4 py-3 text-sm font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {followers.map((follower, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-3">
                <span className="font-medium">{follower.name}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{follower.whatsapp}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCopyWhatsApp(follower.whatsapp)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </td>
              <td className="px-4 py-3">
                <code className="text-sm bg-muted px-2 py-1 rounded">{follower.couponCode}</code>
              </td>
              <td className="px-4 py-3">
                {follower.redeemed ? (
                  <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Redeemed
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </td>
              <td className="px-4 py-3 text-right font-semibold">
                {follower.redeemed ? `₹${follower.purchaseAmount.toLocaleString()}` : '-'}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {follower.redeemed && follower.redeemedAt 
                  ? `Redeemed ${formatDistanceToNow(new Date(follower.redeemedAt), { addSuffix: true })}`
                  : `Generated ${formatDistanceToNow(new Date(follower.generatedAt), { addSuffix: true })}`
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

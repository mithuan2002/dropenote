import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle2, XCircle, Search, Store, TrendingUp, History, Receipt, Award } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Coupon, Campaign } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Label } from "@/components/ui/label";

interface VerificationResult {
  valid: boolean;
  coupon?: Coupon;
  campaign?: Campaign;
  message: string;
}

interface StaffAnalytics {
  totalRedemptions: number;
  totalRevenue: number;
  activeCampaigns: number;
  totalCoupons: number;
}

interface RedemptionHistory {
  id: string;
  redeemedAt: Date;
  purchaseAmount: number;
  couponCode: string;
  customerName: string;
  customerWhatsApp: string;
  campaignName: string;
  discountPercentage: number;
}

interface InfluencerAnalytics {
  totalFollowers: number;
  totalCouponsGenerated: number;
  totalCouponsRedeemed: number;
  topInfluencers: {
    name: string;
    generated: number;
    redeemed: number;
  }[];
  recentRedemptions: RedemptionHistory[];
  recentGenerations: {
    generatedAt: Date;
    couponCode: string;
    customerName: string;
    campaignName: string;
  }[];
}

interface StaffProfile {
  storeName?: string;
  ownerName?: string;
  location?: string;
}

export default function StaffPortal() {
  const [couponCode, setCouponCode] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const { toast } = useToast();

  const { data: profile } = useQuery<StaffProfile>({
    queryKey: ["/api/staff/profile"],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<StaffAnalytics>({
    queryKey: ["/api/staff/analytics"],
  });

  const { data: redemptionHistory, isLoading: historyLoading } = useQuery<RedemptionHistory[]>({
    queryKey: ["/api/staff/redemptions"],
  });

  const { data: influencerAnalytics, isLoading: influencerAnalyticsLoading } = useQuery<InfluencerAnalytics>({
    queryKey: ["/api/staff/influencers/analytics"],
  });

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      return await apiRequest("POST", "/api/coupons/verify", { code });
    },
    onSuccess: (result: VerificationResult) => {
      setVerificationResult(result);
      if (!result.valid) {
        toast({
          title: "Invalid Code",
          description: result.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to verify coupon",
        variant: "destructive",
      });
    },
  });

  const redeemMutation = useMutation({
    mutationFn: async () => {
      if (!verificationResult?.coupon) return;
      return await apiRequest("POST", "/api/redemptions", {
        couponId: verificationResult.coupon.id,
        purchaseAmount: parseInt(purchaseAmount),
      });
    },
    onSuccess: () => {
      toast({
        title: "Coupon Redeemed",
        description: "Purchase has been recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staff/analytics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staff/redemptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staff/influencers/analytics"] });
      setCouponCode("");
      setPurchaseAmount("");
      setVerificationResult(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to redeem coupon",
        variant: "destructive",
      });
    },
  });

  const handleVerify = () => {
    if (couponCode.trim()) {
      verifyMutation.mutate(couponCode.trim().toUpperCase());
    }
  };

  const handleRedeem = () => {
    if (purchaseAmount && parseInt(purchaseAmount) > 0) {
      redeemMutation.mutate();
    } else {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid purchase amount",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold" data-testid="text-portal-title">
                Store Staff Portal
              </h1>
              <p className="text-sm text-muted-foreground">
                {profile?.storeName || "Verify and redeem coupon codes"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/staff/profile">
              <Button variant="outline" data-testid="button-edit-profile">
                <Store className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/';
              }}
              data-testid="button-logout"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {(!profile || !profile.storeName) && (
          <Card className="p-6 mb-6 border-primary/50 bg-primary/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Complete Your Store Profile</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Set up your store information to start verifying coupons
                </p>
                <Link href="/staff/profile">
                  <Button>
                    Set Up Profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        <Tabs defaultValue="verify" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="verify" data-testid="tab-verify">
              <Search className="w-4 h-4 mr-2" />
              Verify
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="influencers" data-testid="tab-influencers">
              <Award className="w-4 h-4 mr-2" />
              Influencers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verify">
            <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Verify Coupon Code</h2>
            <p className="text-sm text-muted-foreground">
              Enter the customer's coupon code to verify and redeem
            </p>
          </div>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="XXXXXX"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setVerificationResult(null);
              }}
              className="h-16 text-center text-2xl font-mono tracking-wider"
              data-testid="input-coupon-code"
            />
            <Button
              onClick={handleVerify}
              className="w-full h-12"
              disabled={verifyMutation.isPending || !couponCode.trim()}
              data-testid="button-verify-code"
            >
              {verifyMutation.isPending ? (
                "Verifying..."
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Verify Code
                </>
              )}
            </Button>
          </div>
        </Card>

        {verificationResult && (
          <Card className="p-6 mt-6">
            {verificationResult.valid && verificationResult.coupon && verificationResult.campaign ? (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2" data-testid="text-valid-status">
                    Valid Coupon
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Campaign:</span>
                    <span className="font-medium" data-testid="text-verified-campaign">
                      {verificationResult.campaign.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="font-medium text-primary" data-testid="text-verified-discount">
                      {verificationResult.campaign.discountPercentage}% OFF
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-medium" data-testid="text-verified-customer">
                      {verificationResult.coupon.followerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WhatsApp:</span>
                    <span className="font-medium" data-testid="text-verified-whatsapp">
                      {verificationResult.coupon.followerWhatsApp}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <label className="block text-sm font-medium mb-2">
                    Purchase Amount (₹)
                  </label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    className="h-12 mb-4"
                    data-testid="input-purchase-amount"
                  />
                  <Button
                    onClick={handleRedeem}
                    className="w-full h-12"
                    disabled={redeemMutation.isPending || !purchaseAmount}
                    data-testid="button-redeem-coupon"
                  >
                    {redeemMutation.isPending ? "Processing..." : "Redeem Coupon"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <XCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
                <h3 className="text-xl font-semibold mb-2" data-testid="text-invalid-status">
                  Invalid Coupon
                </h3>
                <p className="text-muted-foreground" data-testid="text-error-message">
                  {verificationResult.message}
                </p>
              </div>
            )}
          </Card>
        )}
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Redemptions</p>
                    <p className="text-3xl font-bold mt-2" data-testid="text-total-redemptions">
                      {analyticsLoading ? "..." : analytics?.totalRedemptions || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-bold mt-2" data-testid="text-total-revenue">
                      {analyticsLoading ? "..." : `₹${analytics?.totalRevenue?.toLocaleString() || 0}`}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Campaigns</p>
                    <p className="text-3xl font-bold mt-2" data-testid="text-active-campaigns">
                      {analyticsLoading ? "..." : analytics?.activeCampaigns || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Store className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">TotalCoupons Issued</p>
                    <p className="text-3xl font-bold mt-2" data-testid="text-total-coupons">
                      {analyticsLoading ? "..." : analytics?.totalCoupons || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Redemption Rate</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Redeemed</span>
                  <span className="font-medium">
                    {analyticsLoading ? "..." : `${analytics?.totalRedemptions || 0} / ${analytics?.totalCoupons || 0}`}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{
                      width: analytics && analytics.totalCoupons > 0
                        ? `${(analytics.totalRedemptions / analytics.totalCoupons) * 100}%`
                        : "0%",
                    }}
                    data-testid="progress-redemption-rate"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {analyticsLoading
                    ? "..."
                    : analytics && analytics.totalCoupons > 0
                    ? `${((analytics.totalRedemptions / analytics.totalCoupons) * 100).toFixed(1)}% redemption rate`
                    : "0% redemption rate"}
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Redemption History</h2>
              {historyLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading history...</div>
              ) : !redemptionHistory || redemptionHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-history">
                  No redemptions yet
                </div>
              ) : (
                <div className="space-y-4">
                  {redemptionHistory.map((redemption) => (
                    <Card
                      key={redemption.id}
                      className="p-4 hover:bg-muted/50 transition-colors"
                      data-testid={`card-redemption-${redemption.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="font-mono font-semibold text-primary"
                              data-testid={`text-code-${redemption.id}`}
                            >
                              {redemption.couponCode}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              •
                            </span>
                            <span className="text-sm font-medium" data-testid={`text-campaign-${redemption.id}`}>
                              {redemption.campaignName}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Customer: </span>
                              <span className="font-medium" data-testid={`text-customer-${redemption.id}`}>
                                {redemption.customerName}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">WhatsApp: </span>
                              <span className="font-medium" data-testid={`text-whatsapp-${redemption.id}`}>
                                {redemption.customerWhatsApp}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Discount: </span>
                              <span className="font-medium text-primary" data-testid={`text-discount-${redemption.id}`}>
                                {redemption.discountPercentage}% OFF
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Purchase: </span>
                              <span className="font-medium" data-testid={`text-amount-${redemption.id}`}>
                                ₹{redemption.purchaseAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground" data-testid={`text-time-${redemption.id}`}>
                          {formatDistanceToNow(new Date(redemption.redeemedAt), { addSuffix: true })}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="influencers">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Influencer Analytics</h2>
              {influencerAnalyticsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading influencer data...</div>
              ) : !influencerAnalytics ? (
                <div className="text-center py-8 text-muted-foreground">No influencer data available</div>
              ) : (
                <div className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Followers</p>
                          <p className="text-3xl font-bold mt-2" data-testid="text-total-followers">
                            {influencerAnalytics.totalFollowers.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                          <Store className="w-6 h-6 text-cyan-500" />
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Coupons Generated</p>
                          <p className="text-3xl font-bold mt-2" data-testid="text-total-generated-coupons">
                            {influencerAnalytics.totalCouponsGenerated.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                          <Receipt className="w-6 h-6 text-orange-500" />
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">TotalCoupons Redeemed</p>
                          <p className="text-3xl font-bold mt-2" data-testid="text-total-redeemed-coupons">
                            {influencerAnalytics.totalCouponsRedeemed.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-green-500" />
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Top Influencers</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 text-left font-medium text-muted-foreground">Influencer</th>
                            <th className="py-2 text-right font-medium text-muted-foreground">Coupons Generated</th>
                            <th className="py-2 text-right font-medium text-muted-foreground">Coupons Redeemed</th>
                            <th className="py-2 text-right font-medium text-muted-foreground">Redemption Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {influencerAnalytics.topInfluencers.map((influencer, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50">
                              <td className="py-2 text-left font-medium">{influencer.name}</td>
                              <td className="py-2 text-right">{influencer.generated.toLocaleString()}</td>
                              <td className="py-2 text-right">{influencer.redeemed.toLocaleString()}</td>
                              <td className="py-2 text-right">
                                {influencer.generated > 0
                                  ? `${((influencer.redeemed / influencer.generated) * 100).toFixed(1)}%`
                                  : "0.0%"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Recent Coupon Generations</h3>
                      {influencerAnalytics.recentGenerations.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No recent generations</p>
                      ) : (
                        <div className="space-y-4">
                          {influencerAnalytics.recentGenerations.map((generation, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <div>
                                <p className="font-medium">{generation.customerName}</p>
                                <p className="text-muted-foreground">{generation.couponCode}</p>
                              </div>
                              <div className="text-right">
                                <p>{formatDistanceToNow(new Date(generation.generatedAt), { addSuffix: true })}</p>
                                <p className="text-primary font-medium">{generation.campaignName}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>

                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Recent Coupon Redemptions</h3>
                      {influencerAnalytics.recentRedemptions.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No recent redemptions</p>
                      ) : (
                        <div className="space-y-4">
                          {influencerAnalytics.recentRedemptions.map((redemption) => (
                            <div key={redemption.id} className="flex justify-between text-sm">
                              <div>
                                <p className="font-medium">{redemption.customerName}</p>
                                <p className="text-muted-foreground">{redemption.couponCode}</p>
                              </div>
                              <div className="text-right">
                                <p>{formatDistanceToNow(new Date(redemption.redeemedAt), { addSuffix: true })}</p>
                                <p className="text-primary font-medium">{redemption.campaignName}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
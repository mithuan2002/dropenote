import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, XCircle, Search, Store } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Coupon, Campaign } from "@shared/schema";

interface VerificationResult {
  valid: boolean;
  coupon?: Coupon;
  campaign?: Campaign;
  message: string;
}

export default function StaffPortal() {
  const [couponCode, setCouponCode] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["/api/staff/profile"],
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
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
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
          <Link href="/staff/profile">
            <Button variant="outline" data-testid="button-profile">
              <Store className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
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
      </main>
    </div>
  );
}
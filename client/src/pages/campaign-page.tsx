import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { UserGuide } from "@/components/user-guide";

type Campaign = {
  id: string;
  name: string;
  slug: string;
  discountPercentage: number;
  expirationDate: string;
  isActive: boolean;
};

type SubmissionResult = {
  valid: boolean;
  checkoutUrl: string;
  discountPercentage: number;
  message: string;
};

export default function CampaignPage() {
  const { slug } = useParams<{ slug: string }>();
  const [promoCode, setPromoCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsApp, setCustomerWhatsApp] = useState("");
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const { data: campaign, isLoading, error } = useQuery<Campaign>({
    queryKey: ["/api/c", slug],
    queryFn: async () => {
      const res = await fetch(`/api/c/${slug}`);
      if (!res.ok) throw new Error("Campaign not found");
      return res.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { promoCode: string; customerName: string; customerWhatsApp: string }) => {
      const response = await apiRequest("POST", `/api/c/${slug}/submit`, data);
      return response as SubmissionResult;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      promoCode: promoCode.trim(),
      customerName: customerName.trim(),
      customerWhatsApp: customerWhatsApp.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading campaign...</span>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Campaign Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This campaign doesn't exist or may have been removed.
            </p>
            <Button asChild variant="outline" className="w-full" data-testid="button-home">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = new Date(campaign.expirationDate) < new Date();
  const isInactive = !campaign.isActive;

  if (isExpired || isInactive) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-muted-foreground" />
              {campaign.name}
            </CardTitle>
            <CardDescription>
              This campaign is no longer active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                {isExpired 
                  ? "This campaign has expired and is no longer accepting submissions."
                  : "This campaign has been paused by the brand."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.valid ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Promo Code Valid!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span>Invalid Code</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className={result.valid ? "border-primary bg-primary/5" : "border-destructive bg-destructive/5"}>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>

            {result.valid && result.discountPercentage > 0 && (
              <div className="rounded-lg bg-muted p-4 text-center">
                <div className="text-3xl font-bold text-primary">{result.discountPercentage}% OFF</div>
                <div className="text-sm text-muted-foreground mt-1">Your exclusive discount</div>
              </div>
            )}

            <Button 
              asChild 
              className="w-full" 
              size="lg"
              data-testid="button-checkout"
            >
              <a href={result.checkoutUrl} target="_blank" rel="noopener noreferrer">
                {result.valid ? "Claim Discount & Checkout" : "Continue to Checkout"}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              You'll be redirected to the checkout page
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>{campaign.name}</CardTitle>
          <CardDescription>
            Get {campaign.discountPercentage}% off • Expires {new Date(campaign.expirationDate).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <UserGuide
              title="How to Redeem Your Discount"
              steps={[
                "Enter your name and WhatsApp number",
                "Enter the promo code exactly as provided (case-sensitive)",
                "Click 'Verify & Get Checkout Link'",
                "You'll receive a checkout link with your discount applied",
                "Click the checkout button to complete your purchase"
              ]}
              tips={[
                "Make sure your promo code is entered correctly",
                "Your WhatsApp number is used for order verification only",
                "Each promo code can only be used once",
                "The discount is automatically applied in the checkout link"
              ]}
              defaultExpanded={false}
            />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" data-testid="label-customer-name">Your Name</Label>
              <Input
                id="name"
                data-testid="input-customer-name"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" data-testid="label-customer-whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                data-testid="input-customer-whatsapp"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={customerWhatsApp}
                onChange={(e) => setCustomerWhatsApp(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promoCode" data-testid="label-promo-code">Promo Code</Label>
              <Input
                id="promoCode"
                data-testid="input-promo-code"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={submitMutation.isPending}
              data-testid="button-submit-promo"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Get Checkout Link"
              )}
            </Button>

            {submitMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to verify promo code. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

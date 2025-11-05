import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Copy, CheckCircle2 } from "lucide-react";
import type { Campaign, Coupon } from "@shared/schema";
import { insertCouponSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

const formSchema = insertCouponSchema.extend({
  followerWhatsApp: z.string().min(10, "Please enter a valid WhatsApp number"),
});

type FormData = z.infer<typeof formSchema>;

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const [generatedCoupon, setGeneratedCoupon] = useState<Coupon | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const { data: campaign, isLoading } = useQuery<Campaign>({
    queryKey: [`/api/campaigns/${id}`],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaignId: id || "",
      followerName: "",
      followerWhatsApp: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("POST", "/api/coupons", data);
    },
    onSuccess: (coupon: Coupon) => {
      setGeneratedCoupon(coupon);
      toast({
        title: "Coupon generated!",
        description: "Your unique coupon code is ready to use",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate coupon",
        variant: "destructive",
      });
    },
  });

  const handleCopy = async () => {
    if (generatedCoupon) {
      await navigator.clipboard.writeText(generatedCoupon.code);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Coupon code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-4 mx-auto"></div>
            <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Campaign not found</h2>
          <p className="text-muted-foreground mb-4">
            This campaign doesn't exist or has been removed
          </p>
          <Link href="/campaigns">
            <Button>View All Campaigns</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isExpired = new Date(campaign.expirationDate) < new Date();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/campaigns">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold" data-testid="text-campaign-name">
              {campaign.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {campaign.discountPercentage}% discount
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {isExpired ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Campaign Expired</h2>
            <p className="text-muted-foreground mb-4">
              This campaign ended on {new Date(campaign.expirationDate).toLocaleDateString()}
            </p>
            <Link href="/campaigns">
              <Button>View Active Campaigns</Button>
            </Link>
          </Card>
        ) : generatedCoupon ? (
          <Card className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Your Coupon Code</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Show this code at checkout to get {campaign.discountPercentage}% off
            </p>

            <div className="bg-muted rounded-lg p-8 mb-6">
              <div
                className="text-5xl font-mono font-bold tracking-wider mb-4"
                data-testid="text-coupon-code"
              >
                {generatedCoupon.code}
              </div>
              <Button
                variant="outline"
                onClick={handleCopy}
                className="w-full"
                data-testid="button-copy-code"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p data-testid="text-follower-name">Name: {generatedCoupon.followerName}</p>
              <p data-testid="text-follower-whatsapp">WhatsApp: {generatedCoupon.followerWhatsApp}</p>
              <p>Valid until {new Date(campaign.expirationDate).toLocaleDateString()}</p>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-2" data-testid="text-campaign-name">
              {campaign.name}
            </h1>
            <div className="flex gap-2 text-sm text-muted-foreground mb-6">
              <span className="font-semibold text-lg text-foreground">
                {campaign.discountPercentage}% OFF
              </span>
              <span>•</span>
              <span data-testid="text-expiry">
                Valid until {new Date(campaign.expirationDate).toLocaleDateString()}
              </span>
            </div>
            {campaign.termsAndConditions && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="text-sm font-semibold mb-2">Terms and Conditions</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {campaign.termsAndConditions}
                </p>
              </div>
            )}
          </Card>
        )}
      </main>
    </div>
  );
}
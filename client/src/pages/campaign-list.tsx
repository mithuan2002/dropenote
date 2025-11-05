import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag } from "lucide-react";
import { Link } from "wouter";
import type { Campaign } from "@shared/schema";
import { UserGuide } from "@/components/user-guide";

export default function CampaignList() {
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const activeCampaigns = campaigns?.filter(
    (c) => new Date(c.expirationDate) >= new Date()
  );

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold" data-testid="text-campaigns-title">
              Active Campaigns
            </h1>
            <p className="text-sm text-muted-foreground">
              Select a campaign to get your coupon code
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <UserGuide
          title="How to Get Your Coupon"
          steps={[
            "Browse the available campaigns below",
            "Click on any campaign card that interests you",
            "Fill in your details (name and WhatsApp number)",
            "Get your unique coupon code instantly",
            "Show the code at the store checkout to redeem your discount"
          ]}
          tips={[
            "Each coupon can only be used once",
            "Make sure to use the coupon before it expires",
            "Keep your WhatsApp number handy - the creator might send you exclusive deals"
          ]}
        />
        {!activeCampaigns || activeCampaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <Tag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No active campaigns</h2>
            <p className="text-muted-foreground">
              Check back later for new coupon campaigns
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCampaigns.map((campaign) => (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-campaign-${campaign.id}`}>
                  <h3 className="text-xl font-semibold mb-2" data-testid={`text-campaign-name-${campaign.id}`}>
                    {campaign.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-primary" data-testid={`text-discount-${campaign.id}`}>
                      {campaign.discountPercentage}% OFF
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid={`text-expiry-${campaign.id}`}>
                    Valid until {new Date(campaign.expirationDate).toLocaleDateString()}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

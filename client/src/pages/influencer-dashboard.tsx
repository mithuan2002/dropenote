import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, TrendingUp, Users, DollarSign, UserCircle } from "lucide-react";
import { Link } from "wouter";
import type { Campaign } from "@shared/schema";
import CreateCampaignDialog from "@/components/create-campaign-dialog";
import CampaignAnalytics from "@/components/campaign-analytics";

export default function InfluencerDashboard() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const selectedCampaign = campaigns?.find(c => c.id === selectedCampaignId);

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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold" data-testid="text-dashboard-title">
                Influencer Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your campaigns
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/influencer/profile">
              <Button variant="outline" data-testid="button-profile">
                <UserCircle className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-campaign">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!campaigns || campaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No campaigns yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first campaign to start tracking coupon redemptions
            </p>
            <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-first-campaign">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Campaigns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.map((campaign) => {
                  const isExpired = new Date(campaign.expirationDate) < new Date();
                  const isSelected = selectedCampaignId === campaign.id;
                  
                  return (
                    <Card
                      key={campaign.id}
                      className={`p-4 cursor-pointer hover-elevate active-elevate-2 ${isSelected ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedCampaignId(campaign.id)}
                      data-testid={`card-campaign-${campaign.id}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg" data-testid={`text-campaign-name-${campaign.id}`}>
                          {campaign.name}
                        </h3>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            isExpired
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-primary/10 text-primary'
                          }`}
                          data-testid={`badge-status-${campaign.id}`}
                        >
                          {isExpired ? 'Expired' : 'Active'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span data-testid={`text-discount-${campaign.id}`}>
                          {campaign.discountPercentage}% off
                        </span>
                        <span>•</span>
                        <span data-testid={`text-expiry-${campaign.id}`}>
                          Expires {new Date(campaign.expirationDate).toLocaleDateString()}
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {selectedCampaign && (
              <CampaignAnalytics campaignId={selectedCampaign.id} campaignName={selectedCampaign.name} />
            )}
          </div>
        )}
      </main>

      <CreateCampaignDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}

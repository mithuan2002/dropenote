import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, TrendingUp, Users, DollarSign, UserCircle, Copy, CheckCircle2, ExternalLink, Star, LogOut } from "lucide-react";
import { Link } from "wouter";
import type { Campaign, InfluencerProfile } from "@shared/schema";
import CreateCampaignDialog from "@/components/create-campaign-dialog";
import CampaignAnalytics from "@/components/campaign-analytics";
import { useToast } from "@/hooks/use-toast";
import { AppShell, PageHeader, MetricCard, EmptyState, SkeletonCard } from "@/components/layout-primitives";
import { UserGuide } from "@/components/user-guide";

interface TopRedeemer {
  name: string;
  whatsapp: string;
  redemptionCount: number;
  totalSpent: number;
}

export default function InfluencerDashboard() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [copiedCampaignId, setCopiedCampaignId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const { data: topRedeemers } = useQuery<TopRedeemer[]>({
    queryKey: ["/api/influencer/top-redeemers"],
  });

  const { data: profile } = useQuery<InfluencerProfile>({
    queryKey: ["/api/influencer/profile"],
  });

  const handleWhatsAppInvite = (followerName: string, whatsappNumber: string) => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const groupLink = profile?.whatsappGroupLink || '';

    let message = `Hi ${followerName}! 👋\n\nThank you for being a loyal follower and supporting my campaigns! 🎉\n\n`;

    if (groupLink) {
      message += `I'd love to invite you to join my exclusive WhatsApp community where you'll get:\n\n✨ Early access to new deals\n💰 Special discounts\n🎁 Exclusive offers\n\nJoin here: ${groupLink}\n\nLooking forward to having you in the community! 🙌`;
    } else {
      message += `I'd love to connect with you directly on WhatsApp and keep you updated with exclusive deals and offers!\n\nLet me know if you're interested! 🙌`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  const getCampaignUrl = (campaignId: string) => {
    return `${window.location.origin}/campaigns/${campaignId}`;
  };

  const handleCopyUrl = async (campaignId: string) => {
    const url = getCampaignUrl(campaignId);
    await navigator.clipboard.writeText(url);
    setCopiedCampaignId(campaignId);
    toast({
      title: "URL Copied!",
      description: "Share this link with your followers to generate coupons",
    });
    setTimeout(() => setCopiedCampaignId(null), 2000);
  };

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </AppShell>
    );
  }

  const activeCampaigns = campaigns?.filter(c => new Date(c.expirationDate) >= new Date()) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-sm sm:text-base font-semibold truncate" data-testid="text-dashboard-title">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 text-xs sm:text-sm px-2 sm:px-3"
                data-testid="button-profile"
              >
                <Link href="/influencer/profile">
                  <UserCircle className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 sm:px-3"
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  window.location.href = '/';
                }}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AppShell>
        <div className="space-y-6">
            {(!campaigns || campaigns.length === 0) ? (
              <>
                <UserGuide
                  title="Getting Started Guide"
                  steps={[
                    "Set up your profile with name and WhatsApp details",
                    "Click 'New Campaign' to create your first campaign",
                    "Set discount percentage and expiration date",
                    "Copy the campaign URL and share with your followers",
                    "Track redemptions and revenue in real-time"
                  ]}
                  tips={[
                    "Add a WhatsApp group link to build your community",
                    "Share campaign URLs on social media for maximum reach",
                    "Check 'Top Redeemers' to identify your most loyal followers"
                  ]}
                  defaultExpanded={true}
                />
                <Card className="p-6 border-primary/50 bg-primary/5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <UserCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Welcome to Your Dashboard</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Set up your profile and create your first campaign to get started
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link href="/influencer/profile" className="w-full sm:w-auto">
                          <Button variant="outline" className="w-full sm:w-auto">
                            Set Up Profile
                          </Button>
                        </Link>
                        <Button onClick={() => setShowCreateDialog(true)} className="w-full sm:w-auto">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Campaign
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <UserGuide
                title="Dashboard Guide"
                steps={[
                  "Create new campaigns using the 'New Campaign' button",
                  "Copy campaign URLs and share them with your followers",
                  "Click on a campaign card to view detailed analytics",
                  "Invite top redeemers to your WhatsApp community",
                  "Monitor your revenue and redemption metrics"
                ]}
                tips={[
                  "Update your profile to add WhatsApp group links",
                  "Share campaign URLs on Instagram, Twitter, and other platforms",
                  "Engage with top redeemers to build loyalty"
                ]}
              />
            )}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Campaigns</h2>
                  <Button onClick={() => setShowCreateDialog(true)} className="h-9" data-testid="button-create-campaign">
                    <Plus className="w-4 h-4 mr-1.5" />
                    New Campaign
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns?.map((campaign) => {
                  const isExpired = new Date(campaign.expirationDate) < new Date();
                  const isSelected = selectedCampaignId === campaign.id;

                  return (
                    <Card
                      key={campaign.id}
                      className={`p-4 ${isSelected ? 'ring-2 ring-primary' : ''}`}
                      data-testid={`card-campaign-${campaign.id}`}
                    >
                      <div
                        className="cursor-pointer hover-elevate active-elevate-2 -m-4 p-4 mb-0"
                        onClick={() => setSelectedCampaignId(campaign.id)}
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
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span data-testid={`text-discount-${campaign.id}`}>
                            {campaign.discountPercentage}% off
                          </span>
                          <span>•</span>
                          <span data-testid={`text-expiry-${campaign.id}`}>
                            Expires {new Date(campaign.expirationDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {!isExpired && (
                        <div className="border-t pt-3 mt-3 space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Share this link with your followers:</p>
                            <div className="flex gap-2">
                              <div className="flex-1 min-w-0 bg-muted rounded px-3 py-2 text-xs font-mono truncate">
                                {getCampaignUrl(campaign.id)}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="shrink-0 px-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyUrl(campaign.id);
                                }}
                                data-testid={`button-copy-url-${campaign.id}`}
                              >
                                {copiedCampaignId === campaign.id ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                              <Link href={`/campaigns/${campaign.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="shrink-0 px-3"
                                  onClick={(e) => e.stopPropagation()}
                                  data-testid={`button-view-${campaign.id}`}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            className="w-full min-h-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCampaignId(campaign.id);
                            }}
                            data-testid={`button-analytics-${campaign.id}`}
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            View Analytics
                          </Button>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>

            {selectedCampaign && (
              <CampaignAnalytics campaignId={selectedCampaign.id} campaignName={selectedCampaign.name} />
            )}

            {topRedeemers && topRedeemers.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">Top Redeemers</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Your most loyal followers - add them to your WhatsApp/Telegram community
                    </p>
                  </div>
                </div>
                
                {/* Desktop Table View */}
                <Card className="overflow-hidden hidden md:block">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium">Follower</th>
                          <th className="text-left px-4 py-3 text-sm font-medium">WhatsApp</th>
                          <th className="text-right px-4 py-3 text-sm font-medium">Redemptions</th>
                          <th className="text-right px-4 py-3 text-sm font-medium">Total Spent</th>
                          <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topRedeemers.map((redeemer, index) => (
                          <tr key={redeemer.whatsapp} className="border-t">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {index < 3 && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                <span className="font-medium">{redeemer.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-sm">{redeemer.whatsapp}</td>
                            <td className="px-4 py-3 text-right">
                              <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                {redeemer.redemptionCount}x
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-semibold">
                              ₹{redeemer.totalSpent.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                className="whitespace-nowrap"
                                onClick={() => handleWhatsAppInvite(redeemer.name, redeemer.whatsapp)}
                                data-testid={`button-whatsapp-${index}`}
                              >
                                Invite to Group
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {topRedeemers.map((redeemer, index) => (
                    <Card key={redeemer.whatsapp} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {index < 3 && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                            <div>
                              <p className="font-medium text-sm">{redeemer.name}</p>
                              <p className="text-xs text-muted-foreground font-mono mt-0.5">{redeemer.whatsapp}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Redemptions</p>
                            <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                              {redeemer.redemptionCount}x
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                            <p className="font-semibold">₹{redeemer.totalSpent.toLocaleString()}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full min-h-10 text-xs sm:text-sm"
                          onClick={() => handleWhatsAppInvite(redeemer.name, redeemer.whatsapp)}
                          data-testid={`button-whatsapp-${index}`}
                        >
                          Invite to Group
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mt-2 text-center">
                  💡 Tip: Click "Invite to Group" to send a personalized WhatsApp message with your community link
                  {!profile?.whatsappGroupLink && " (Set up your WhatsApp group link in your profile first)"}
                </p>
              </div>
            )}
        </div>
      </AppShell>

      <CreateCampaignDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
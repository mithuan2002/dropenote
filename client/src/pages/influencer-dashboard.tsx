import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, TrendingUp, Users, DollarSign, UserCircle, Copy, CheckCircle2, ExternalLink, Star } from "lucide-react";
import { Link } from "wouter";
import type { Campaign } from "@shared/schema";
import CreateCampaignDialog from "@/components/create-campaign-dialog";
import CampaignAnalytics from "@/components/campaign-analytics";
import { useToast } from "@/hooks/use-toast";

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

  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const { data: topRedeemers } = useQuery<TopRedeemer[]>({
    queryKey: ["/api/influencer/top-redeemers"],
  });

  const { data: profile } = useQuery({
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
            <Button 
              variant="outline"
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/';
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {selectedCampaign ? (
          <CampaignAnalytics
            campaignId={selectedCampaign.id}
            campaignName={selectedCampaign.name}
          />
        ) : (
          <div className="space-y-6">
            {(!campaigns || campaigns.length === 0) && (
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
                    <div className="flex gap-2">
                      <Link href="/influencer/profile">
                        <Button variant="outline">
                          Set Up Profile
                        </Button>
                      </Link>
                      <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Campaign
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Campaigns</h2>
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
                        <div className="border-t pt-3 mt-3">
                          <p className="text-xs text-muted-foreground mb-2">Share this link with your followers:</p>
                          <div className="flex gap-2">
                            <div className="flex-1 bg-muted rounded px-3 py-2 text-xs font-mono truncate">
                              {getCampaignUrl(campaign.id)}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
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
                                onClick={(e) => e.stopPropagation()}
                                data-testid={`button-view-${campaign.id}`}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
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
                    <h2 className="text-lg font-semibold">Top Redeemers</h2>
                    <p className="text-sm text-muted-foreground">
                      Your most loyal followers - add them to your WhatsApp/Telegram community
                    </p>
                  </div>
                </div>
                <Card className="overflow-hidden">
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
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  💡 Tip: Click "Invite to Group" to send a personalized WhatsApp message with your community link
                  {!profile?.whatsappGroupLink && " (Set up your WhatsApp group link in your profile first)"}
                </p>
              </div>
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
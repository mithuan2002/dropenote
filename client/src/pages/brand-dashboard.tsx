import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Plus, ExternalLink, User, BarChart3, Users, Calendar, Copy, Check } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Campaign } from "@shared/schema";

export default function BrandDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setLocation('/login');
  };

  const copyUrl = (slug: string) => {
    const url = `${window.location.origin}/c/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    toast({ title: "Campaign URL copied!", description: url });
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <h1 className="font-semibold text-lg">Brand Dashboard</h1>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" data-testid="link-profile">
                <Link href="/brand/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="sm" data-testid="button-logout">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Your Campaigns</h2>
            <p className="text-sm text-muted-foreground">Create and manage promo campaigns</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-campaign">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Campaign</DialogTitle>
                <DialogDescription>
                  Set up a new promo campaign with a hosted page
                </DialogDescription>
              </DialogHeader>
              <CreateCampaignForm onSuccess={() => setIsCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No campaigns yet. Create your first one!</p>
              <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-first">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover-elevate">
                <CardHeader>
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CardDescription>
                    {campaign.discountPercentage}% off • Code: {campaign.promoCode}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Expires {new Date(campaign.expirationDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => copyUrl(campaign.slug)}
                      data-testid={`button-copy-${campaign.slug}`}
                    >
                      {copiedSlug === campaign.slug ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy URL
                        </>
                      )}
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      data-testid={`button-view-${campaign.slug}`}
                    >
                      <a href={`/c/${campaign.slug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <CampaignAnalytics campaignId={campaign.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function CreateCampaignForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    promoCode: "",
    discountPercentage: 10,
    discountedCheckoutUrl: "",
    normalCheckoutUrl: "",
    expirationDate: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("/api/campaigns", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({ title: "Campaign created!", description: "Your campaign is now live" });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Summer Sale 2025"
          required
          data-testid="input-campaign-name"
        />
      </div>
      <div>
        <Label htmlFor="slug">URL Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
          placeholder="summer-sale"
          required
          data-testid="input-slug"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Campaign will be at: {window.location.origin}/c/{formData.slug || 'your-slug'}
        </p>
      </div>
      <div>
        <Label htmlFor="promoCode">Promo Code</Label>
        <Input
          id="promoCode"
          value={formData.promoCode}
          onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
          placeholder="SUMMER25"
          required
          data-testid="input-promo-code"
        />
      </div>
      <div>
        <Label htmlFor="discount">Discount Percentage</Label>
        <Input
          id="discount"
          type="number"
          min="1"
          max="100"
          value={formData.discountPercentage}
          onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) })}
          required
          data-testid="input-discount"
        />
      </div>
      <div>
        <Label htmlFor="discountedUrl">Discounted Checkout URL</Label>
        <Input
          id="discountedUrl"
          type="url"
          value={formData.discountedCheckoutUrl}
          onChange={(e) => setFormData({ ...formData, discountedCheckoutUrl: e.target.value })}
          placeholder="https://yourstore.com/checkout?discount=SUMMER25"
          required
          data-testid="input-discounted-url"
        />
      </div>
      <div>
        <Label htmlFor="normalUrl">Normal Checkout URL</Label>
        <Input
          id="normalUrl"
          type="url"
          value={formData.normalCheckoutUrl}
          onChange={(e) => setFormData({ ...formData, normalCheckoutUrl: e.target.value })}
          placeholder="https://yourstore.com/checkout"
          required
          data-testid="input-normal-url"
        />
      </div>
      <div>
        <Label htmlFor="expiration">Expiration Date</Label>
        <Input
          id="expiration"
          type="date"
          value={formData.expirationDate}
          onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
          required
          data-testid="input-expiration"
        />
      </div>
      <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-campaign">
        {createMutation.isPending ? "Creating..." : "Create Campaign"}
      </Button>
    </form>
  );
}

function CampaignAnalytics({ campaignId }: { campaignId: string }) {
  const { data: analytics } = useQuery({
    queryKey: ["/api/campaigns", campaignId, "analytics"],
    queryFn: async () => {
      const res = await fetch(`/api/campaigns/${campaignId}/analytics`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });

  if (!analytics) return null;

  return (
    <div className="grid grid-cols-2 gap-2 pt-3 border-t text-sm">
      <div>
        <div className="text-muted-foreground">Submissions</div>
        <div className="font-semibold">{analytics.totalSubmissions}</div>
      </div>
      <div>
        <div className="text-muted-foreground">Success Rate</div>
        <div className="font-semibold">{analytics.successRate}%</div>
      </div>
    </div>
  );
}

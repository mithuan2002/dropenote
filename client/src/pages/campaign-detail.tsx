import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle2, XCircle, Copy, ExternalLink, BarChart3, Users, TrendingUp, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

// Define a UserGuide component for displaying instructions
function UserGuide({ title, steps, tips, defaultExpanded = true }: { title: string; steps?: string[]; tips?: string[]; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
          {expanded ? <Percent className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
        </Button>
      </CardHeader>
      {expanded && (
        <CardContent>
          {steps && (
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">Key Steps:</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}
          {tips && (
            <div>
              <h3 className="text-md font-semibold mb-2">Tips:</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

interface Campaign {
  id: string;
  name: string;
  slug: string;
  promoCode: string;
  discountPercentage: number;
  discountedCheckoutUrl: string;
  normalCheckoutUrl: string;
  expirationDate: string;
  isActive: boolean;
}

interface Analytics {
  totalSubmissions: number;
  validSubmissions: number;
  invalidSubmissions: number;
  successRate: number;
}

interface Submission {
  id: string;
  customerName: string;
  customerWhatsApp: string;
  promoCodeEntered: string;
  wasValid: boolean;
  submittedAt: string;
}

interface BrandProfile {
  whatsappGroupLink?: string | null;
}

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: campaign, isLoading: campaignLoading } = useQuery<Campaign>({
    queryKey: [`/api/campaigns/${id}`],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
    queryKey: [`/api/campaigns/${id}/analytics`],
  });

  const { data: submissions, isLoading: submissionsLoading } = useQuery<Submission[]>({
    queryKey: [`/api/campaigns/${id}/submissions`],
  });

  const { data: brandProfile } = useQuery<BrandProfile>({
    queryKey: ["/api/brand/profile"],
  });

  const handleCopyUrl = async () => {
    if (!campaign) return;
    const url = `${window.location.origin}/c/${campaign.slug}`;
    await navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Campaign URL copied to clipboard",
    });
  };

  const handleCopyWhatsApp = async (whatsapp: string) => {
    await navigator.clipboard.writeText(whatsapp);
    toast({
      title: "Copied!",
      description: "WhatsApp number copied to clipboard",
    });
  };

  if (campaignLoading || analyticsLoading || submissionsLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign || !analytics || !submissions) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-muted-foreground">Campaign not found</p>
        </div>
      </div>
    );
  }

  const validSubmissions = submissions.filter(s => s.wasValid);
  const invalidSubmissions = submissions.filter(s => !s.wasValid);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/brand/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{campaign.name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant={campaign.isActive ? "default" : "secondary"}>
                  {campaign.isActive ? "Active" : "Inactive"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Expires {new Date(campaign.expirationDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopyUrl}>
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
              <Button variant="outline" asChild>
                <a href={`/c/${campaign.slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Page
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* User Guide for the page */}
        <div className="mb-6">
          <UserGuide
            title="Campaign Details & Management Guide"
            steps={[
              "View campaign performance metrics (submissions, success rate) in the Analytics tab.",
              "Review all customer interactions and promo code usage in the Submissions tab.",
              "Share the unique Campaign URL (displayed at the top) with your target audience.",
              "Monitor the 'Expires' date to ensure timely campaign management.",
              "Use the 'Copy URL' button for easy sharing.",
              "Click 'View Page' to see the live campaign landing page.",
            ]}
            tips={[
              "Active campaigns are highlighted with a 'default' badge.",
              "Inactive campaigns are shown with a 'secondary' badge.",
              "The Promo Code and Discount Percentage are key details for customer awareness.",
              "The Success Rate is a crucial indicator for campaign effectiveness.",
            ]}
            defaultExpanded={true}
          />
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Submissions</span>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{analytics.totalSubmissions}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Valid Codes</span>
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-green-600">{analytics.validSubmissions}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Invalid Codes</span>
              <XCircle className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-red-600">{analytics.invalidSubmissions}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <Percent className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{analytics.successRate}%</div>
          </Card>
        </div>

        {/* Campaign Details */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Promo Code</span>
                <p className="font-mono font-semibold">{campaign.promoCode}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Discount</span>
                <p className="font-semibold">{campaign.discountPercentage}% OFF</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Campaign URL</span>
                <p className="font-mono text-sm text-primary">/c/{campaign.slug}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Status</span>
                <p className="font-semibold">{campaign.isActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
            {/* Crucial Payout URLs */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-sm text-muted-foreground">Normal Payout URL</span>
                <p className="font-mono text-sm break-all">
                  <a href={campaign.normalCheckoutUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {campaign.normalCheckoutUrl} <ExternalLink className="inline-block h-3 w-3 ml-1" />
                  </a>
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Discount Payout URL</span>
                <p className="font-mono text-sm break-all">
                  <a href={campaign.discountedCheckoutUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {campaign.discountedCheckoutUrl} <ExternalLink className="inline-block h-3 w-3 ml-1" />
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card>
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                  All Submissions ({submissions.length})
                </TabsTrigger>
                <TabsTrigger value="valid">
                  Valid ({validSubmissions.length})
                </TabsTrigger>
                <TabsTrigger value="invalid">
                  Invalid ({invalidSubmissions.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="p-6 pt-4">
              <SubmissionsTable submissions={submissions} onCopyWhatsApp={handleCopyWhatsApp} whatsappGroupLink={brandProfile?.whatsappGroupLink} />
            </TabsContent>

            <TabsContent value="valid" className="p-6 pt-4">
              <SubmissionsTable submissions={validSubmissions} onCopyWhatsApp={handleCopyWhatsApp} whatsappGroupLink={brandProfile?.whatsappGroupLink} />
            </TabsContent>

            <TabsContent value="invalid" className="p-6 pt-4">
              <SubmissionsTable submissions={invalidSubmissions} onCopyWhatsApp={handleCopyWhatsApp} whatsappGroupLink={brandProfile?.whatsappGroupLink} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

function SubmissionsTable({
  submissions,
  onCopyWhatsApp,
  whatsappGroupLink
}: {
  submissions: Submission[];
  onCopyWhatsApp: (whatsapp: string) => void;
  whatsappGroupLink?: string | null;
}) {
  const handleAddToGroup = (whatsapp: string) => {
    if (!whatsappGroupLink) {
      return;
    }
    // Format WhatsApp number (remove + and spaces)
    const formattedNumber = whatsapp.replace(/[\s+]/g, '');
    // Create WhatsApp message link to invite them to the group
    const message = encodeURIComponent(`Hi! Here's the link to join our exclusive WhatsApp group: ${whatsappGroupLink}`);
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No submissions yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-medium">Customer Name</th>
            <th className="text-left px-4 py-3 text-sm font-medium">WhatsApp</th>
            <th className="text-left px-4 py-3 text-sm font-medium">Code Entered</th>
            <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
            <th className="text-left px-4 py-3 text-sm font-medium">Submitted</th>
            {whatsappGroupLink && (
              <th className="text-left px-4 py-3 text-sm font-medium">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className="border-t">
              <td className="px-4 py-3">
                <span className="font-medium">{submission.customerName}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{submission.customerWhatsApp}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCopyWhatsApp(submission.customerWhatsApp)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </td>
              <td className="px-4 py-3">
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {submission.promoCodeEntered}
                </code>
              </td>
              <td className="px-4 py-3">
                {submission.wasValid ? (
                  <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Valid
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Invalid
                  </Badge>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
              </td>
              {whatsappGroupLink && (
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddToGroup(submission.customerWhatsApp)}
                    className="h-8"
                  >
                    Add to Group
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
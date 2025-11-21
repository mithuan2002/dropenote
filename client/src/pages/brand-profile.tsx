import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UserGuide } from "@/components/user-guide";

type BrandProfile = {
  brandName: string;
  website: string;
  contactEmail: string;
};

export default function BrandProfile() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<BrandProfile>({
    brandName: "",
    website: "",
    contactEmail: "",
  });

  const { data: profile, isLoading } = useQuery<BrandProfile>({
    queryKey: ["/api/brand/profile"],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        brandName: profile.brandName || "",
        website: profile.website || "",
        contactEmail: profile.contactEmail || "",
      });
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: async (data: BrandProfile) => {
      return await apiRequest("POST", "/api/brand/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brand/profile"] });
      toast({ title: "Profile saved!", description: "Your brand profile has been updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="flex h-16 items-center">
            <Button asChild variant="ghost" size="sm" data-testid="link-back">
              <Link href="/brand">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Brand Profile</h1>

        <div className="mb-6">
          <UserGuide
            title="Profile Settings Guide"
            steps={[
              "Add your WhatsApp group link to engage with customers",
              "Terms and conditions will be shown to customers during checkout",
              "Update your information anytime and click Save Changes"
            ]}
            tips={[
              "WhatsApp group link: Share your community or support group",
              "Terms: Include refund policy, usage restrictions, etc.",
              "All changes are saved immediately when you click the button"
            ]}
            defaultExpanded={false}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Brand Profile</CardTitle>
            <CardDescription>
              Update your brand information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  placeholder="Your Brand Name"
                  required
                  data-testid="input-brand-name"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourbrand.com"
                  data-testid="input-website"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contact@yourbrand.com"
                  data-testid="input-email"
                />
              </div>
              <Button type="submit" className="w-full" disabled={saveMutation.isPending} data-testid="button-save">
                {saveMutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Tag, UserCircle } from "lucide-react";

export default function Home() {
  const appUrl = window.location.origin;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`;

  const roles = [
    {
      title: "Influencer",
      description: "Create campaigns and track performance",
      icon: UserCircle,
      path: "/influencer",
      testId: "link-influencer"
    },
    {
      title: "Store Staff",
      description: "Verify and redeem coupon codes",
      icon: Store,
      path: "/staff",
      testId: "link-staff"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Dropnote</h1>
          <p className="text-xl text-muted-foreground mb-2">
            Create coupon campaigns, distribute unique codes, and track redemptions
          </p>
          <p className="text-muted-foreground mb-6">
            Identify your most loyal followers
          </p>

          <Card className="inline-block mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Install Our PWA</CardTitle>
              <CardDescription>Scan to install Dropnote on your device</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <img
                src={qrCodeUrl}
                alt="QR Code to install PWA"
                className="w-48 h-48 border-2 border-border rounded-lg"
              />
              <p className="text-sm text-muted-foreground">
                Or install directly from your browser
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {roles.map((role) => (
            <Link key={role.path} href={role.path}>
              <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer h-32 flex flex-col items-center justify-center text-center" data-testid={role.testId}>
                <role.icon className="w-8 h-8 mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">{role.title}</h2>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Tag, UserCircle, Download } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const appUrl = window.location.origin;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`;
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

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
              <CardTitle className="text-lg">Install Dropnote App</CardTitle>
              <CardDescription>Access Dropnote offline and from your home screen</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {showInstallButton && (
                <Button onClick={handleInstallClick} size="lg" className="w-full max-w-xs">
                  <Download className="mr-2 h-5 w-5" />
                  Install App
                </Button>
              )}
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Scan to open on mobile:</p>
                <img
                  src={qrCodeUrl}
                  alt="QR Code to open app"
                  className="w-48 h-48 border-2 border-border rounded-lg mx-auto"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Then use your browser's "Add to Home Screen" option
                </p>
              </div>
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
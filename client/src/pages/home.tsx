import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Tag, UserCircle, Download } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const appUrl = window.location.origin;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`;
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [, setLocation] = useLocation();


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

          {showInstallButton && (
            <Card className="inline-block mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Install Dropnote App</CardTitle>
                <CardDescription>Access Dropnote offline and from your home screen</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Button onClick={handleInstallClick} size="lg" className="w-full max-w-xs">
                  <Download className="mr-2 h-5 w-5" />
                  Install App
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="mb-6 p-4 bg-muted rounded-lg text-sm">
            <h3 className="font-semibold mb-2">How to install on mobile:</h3>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Scan the QR code for your portal (Influencer or Store Staff)</li>
              <li>Open the page in your browser</li>
              <li><strong>iPhone:</strong> Tap the Share button, then "Add to Home Screen"</li>
              <li><strong>Android:</strong> Tap the menu (⋮), then "Add to Home screen" or "Install app"</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-primary" />
                  Influencer Portal
                </CardTitle>
                <CardDescription>Scan to access influencer dashboard</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl + '/influencer')}`}
                  alt="QR Code for Influencer Portal"
                  className="w-48 h-48 border-2 border-border rounded-lg"
                />
                <p className="text-xs text-muted-foreground text-center">
                  For campaign creators to manage and track campaigns
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  Store Staff Portal
                </CardTitle>
                <CardDescription>Scan to access store verification</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl + '/staff')}`}
                  alt="QR Code for Store Staff Portal"
                  className="w-48 h-48 border-2 border-border rounded-lg"
                />
                <p className="text-xs text-muted-foreground text-center">
                  For retail staff to verify and redeem coupons
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Button 
            size="lg" 
            className="w-full h-32 text-lg"
            onClick={() => setLocation("/login")}
          >
            <UserCircle className="mr-2 h-8 w-8" />
            I'm an Influencer
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full h-32 text-lg"
            onClick={() => setLocation("/login")}
          >
            <Store className="mr-2 h-8 w-8" />
            I'm Store Staff
          </Button>
        </div>
      </div>
    </div>
  );
}
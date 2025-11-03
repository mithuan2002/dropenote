import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Tag, UserCircle, Download } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  // Construct full URL with protocol for QR codes
  const protocol = window.location.protocol;
  const host = window.location.host;
  // Ensure we use the full HTTPS URL for QR codes
  const appUrl = `${protocol}//${host}`.replace('http://', 'https://');
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
            Coupon management system for influencers
          </p>
          <p className="text-muted-foreground mb-6">
            Identify and reward your loyal followers
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

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <h3 className="font-semibold mb-3 text-blue-900">📱 Install as Mobile App</h3>
            <div className="space-y-3 text-blue-800">
              <div>
                <strong className="block mb-1">Step 1:</strong>
                <span className="text-sm">Scan the QR code below with your phone camera</span>
              </div>
              <div>
                <strong className="block mb-1">Step 2: Install the app</strong>
                <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                  <li><strong>iPhone/iPad:</strong> Tap Share <span className="inline-block">⎙</span> → "Add to Home Screen"</li>
                  <li><strong>Android:</strong> Tap menu <span className="inline-block">⋮</span> → "Install app" or "Add to Home screen"</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8 max-w-md mx-auto px-4">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <span className="text-3xl">🛍️</span>
                  For Influencers
                </CardTitle>
                <CardDescription className="text-base">
                  Create campaigns and track your coupon performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full h-14 text-lg font-semibold">
                  <Link href="/login?role=influencer">
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <span className="text-3xl">🏪</span>
                  For Store Staff
                </CardTitle>
                <CardDescription className="text-base">
                  Verify and redeem customer coupons quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full h-14 text-lg font-semibold">
                  <Link href="/login?role=staff">
                    Access Portal
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Button
            size="lg"
            className="w-full h-32 text-lg"
            onClick={() => setLocation("/login")}
            data-testid="button-influencer-login"
          >
            <UserCircle className="mr-2 h-8 w-8" />
            I'm an Influencer
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full h-32 text-lg"
            onClick={() => setLocation("/login")}
            data-testid="button-staff-login"
          >
            <Store className="mr-2 h-8 w-8" />
            I'm Store Staff
          </Button>
        </div>
      </div>
    </div>
  );
}
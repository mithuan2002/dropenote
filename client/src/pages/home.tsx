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

          <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <h3 className="font-semibold mb-4 text-blue-900 text-lg text-center">📱 Install as Mobile App</h3>
            
            <div className="flex flex-col items-center mb-4">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code to install app" 
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-blue-800 text-center font-medium">
                Scan with your phone camera
              </p>
            </div>

            <div className="space-y-3 text-blue-800 text-sm">
              <div className="bg-white p-3 rounded-lg">
                <strong className="block mb-1 text-blue-900">📱 iPhone/iPad:</strong>
                <span>Tap Share <span className="inline-block text-lg">⎙</span> → "Add to Home Screen"</span>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <strong className="block mb-1 text-blue-900">🤖 Android:</strong>
                <span>Tap menu <span className="inline-block text-lg">⋮</span> → "Install app"</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8 max-w-md mx-auto px-4">
            <Card className="border-2 hover:border-primary transition-colors shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <span className="text-4xl">🛍️</span>
                  For Influencers
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Create campaigns and track your coupon performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full h-16 text-lg font-semibold shadow-md">
                  <Link href="/login?role=influencer">
                    <UserCircle className="mr-2 h-6 w-6" />
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <span className="text-4xl">🏪</span>
                  For Store Staff
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Verify and redeem customer coupons quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full h-16 text-lg font-semibold shadow-md border-2">
                  <Link href="/login?role=staff">
                    <Store className="mr-2 h-6 w-6" />
                    Access Portal
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
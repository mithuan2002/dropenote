import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, UserCircle, Download, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setLocation] = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    fetch('/api/auth/status')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/influencer-dashboard');
    }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebApp = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInWebApp) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert('To install this app:\n\niPhone: Tap Share → Add to Home Screen\nAndroid: Tap menu (⋮) → Install app\nDesktop: Look for install icon in address bar');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstalled(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🎟️</div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
        <div className="text-center space-y-6">
          <div className="mb-6">
            <div className="inline-block p-4 bg-primary rounded-2xl shadow-lg mb-4">
              <span className="text-5xl">🎟️</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dropnote
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-2 font-medium">
              Coupon management system for influencers
            </p>
            <p className="text-sm sm:text-base text-muted-foreground">
              Identify and reward your loyal followers
            </p>
          </div>

          {!isInstalled && (
            <div className="mb-6">
              <Button 
                onClick={handleInstall}
                size="lg"
                className="w-full max-w-md min-h-[64px] text-xl font-bold shadow-xl hover:shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
                data-testid="button-install-pwa"
              >
                <Download className="mr-3 h-6 w-6" />
                Install App Now
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Works offline • Fast loading • Native experience
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center justify-center gap-3 text-xl sm:text-2xl">
                  <span className="text-3xl sm:text-4xl">🛍️</span>
                  For Influencers
                </CardTitle>
                <CardDescription className="text-sm sm:text-base mt-2">
                  Create campaigns and track your coupon performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  asChild 
                  className="w-full min-h-[56px] sm:h-16 text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-all touch-manipulation"
                  data-testid="button-influencer-login"
                >
                  <Link href="/login?role=influencer">
                    <UserCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center justify-center gap-3 text-xl sm:text-2xl">
                  <span className="text-3xl sm:text-4xl">🏪</span>
                  For Store Staff
                </CardTitle>
                <CardDescription className="text-sm sm:text-base mt-2">
                  Verify and redeem customer coupons quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full min-h-[56px] sm:h-16 text-base sm:text-lg font-semibold shadow-md hover:shadow-lg border-2 transition-all touch-manipulation"
                  data-testid="button-staff-login"
                >
                  <Link href="/login?role=staff">
                    <Store className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                    Access Portal
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-4 sm:p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
            <p className="text-xs sm:text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Install this app on your device for the best experience. 
              Tap the button above or your browser's menu to install.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
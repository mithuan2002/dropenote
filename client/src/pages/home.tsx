import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, UserCircle, Smartphone, Share, Plus, Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showInstructions, setShowInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    fetch('/api/auth/status')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setLocation('/influencer-dashboard');
        }
      })
      .catch(() => {
        // Not authenticated, stay on home page
      });

    // Check if already running as installed app
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebApp = (window.navigator as any).standalone === true;
    if (isStandalone || isInWebApp) {
      setIsInstalled(true);
    }
  }, [setLocation]);

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  // Detect browser/device
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 sm:py-10 max-w-2xl">
        <div className="text-center space-y-4">
          <div className="mb-4">
            <div className="inline-block p-3 bg-primary rounded-xl shadow-md mb-3">
              <span className="text-4xl sm:text-5xl">🎟️</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dropnote
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground mb-2 font-medium">
              Coupon management for influencers
            </p>
            <p className="text-sm sm:text-base text-muted-foreground">
              Identify and reward your loyal followers
            </p>
          </div>

          {!isInstalled && (
            <div className="mb-4">
              <Button
                onClick={handleShowInstructions}
                size="default"
                className="w-full text-base font-semibold shadow-lg"
                data-testid="button-install-pwa"
              >
                <Smartphone className="mr-2 h-5 w-5" />
                Add to Home Screen
              </Button>
            </div>
          )}

          {showInstructions && (
            <Card className="text-left border-2 border-blue-500 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Add to Home Screen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isIOS && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-300 dark:border-blue-700">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2 text-sm">
                      <span className="text-lg">🍎</span> iPhone/iPad:
                    </p>
                    <ol className="space-y-2 text-xs">
                      <li className="flex items-start gap-2">
                        <span className="font-bold min-w-[20px]">1.</span>
                        <span>Tap the <strong>Share</strong> button <Share className="inline h-4 w-4 mx-1" /> at the bottom of Safari</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold min-w-[20px]">2.</span>
                        <span>Scroll down and tap <strong>"Add to Home Screen"</strong> <Plus className="inline h-4 w-4 mx-1" /></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold min-w-[20px]">3.</span>
                        <span>Tap <strong>"Add"</strong> in the top right</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold min-w-[20px]">4.</span>
                        <span>The app icon will appear on your home screen! 🎉</span>
                      </li>
                    </ol>
                  </div>
                )}

                {isAndroid && (
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-300 dark:border-green-700">
                    <p className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2 text-sm">
                      <span className="text-lg">🤖</span> Android:
                    </p>
                    <ol className="space-y-2 text-xs">
                      <li className="flex items-start gap-2">
                        <span className="font-bold min-w-[20px]">1.</span>
                        <span>Tap the <strong>Menu</strong> button <Menu className="inline h-4 w-4 mx-1" /> (three dots) in the top right</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold min-w-[20px]">2.</span>
                        <span>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold min-w-[20px]">3.</span>
                        <span>Tap <strong>"Add"</strong> or <strong>"Install"</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold min-w-[20px]">4.</span>
                        <span>The app icon will appear on your home screen! 🎉</span>
                      </li>
                    </ol>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    💡 <strong>Benefits:</strong>
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✅ Quick access • Works offline • Fast loading</li>
                  </ul>
                </div>

                <Button
                  onClick={() => setShowInstructions(false)}
                  variant="outline"
                  className="w-full text-sm font-medium"
                  data-testid="button-close-instructions"
                >
                  Got it
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-4">
            <Card className="border hover:border-primary transition-all hover:shadow-md">
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold">
                  For Influencers
                </CardTitle>
                <CardDescription className="text-sm sm:text-base mt-2 text-center">
                  Create campaigns and track performance
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  asChild
                  className="w-full text-base font-semibold shadow-sm hover:shadow-md transition-all"
                  data-testid="button-influencer-login"
                >
                  <Link href="/login?role=influencer">
                    <UserCircle className="mr-2 h-5 w-5" />
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border hover:border-primary transition-all hover:shadow-md">
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold">
                  For Store Staff
                </CardTitle>
                <CardDescription className="text-sm sm:text-base mt-2 text-center">
                  Verify and redeem coupons quickly
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  asChild
                  variant="outline"
                  className="w-full text-base font-semibold shadow-sm hover:shadow-md transition-all"
                  data-testid="button-staff-login"
                >
                  <Link href="/login?role=staff">
                    <Store className="mr-2 h-5 w-5" />
                    Access Portal
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {!showInstructions && (
            <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> Add to home screen for quick access
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
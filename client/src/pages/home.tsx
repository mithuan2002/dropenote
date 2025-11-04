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
            <div className="mb-6 space-y-4">
              <Button
                onClick={handleShowInstructions}
                size="lg"
                className="w-full max-w-md min-h-[64px] text-xl font-bold shadow-xl hover:shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
                data-testid="button-install-pwa"
              >
                <Smartphone className="mr-3 h-6 w-6" />
                Add to Home Screen
              </Button>
            </div>
          )}

          {showInstructions && (
            <Card className="text-left border-2 border-blue-500 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Add to Home Screen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isIOS && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                    <p className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                      <span className="text-2xl">🍎</span> iPhone/iPad Instructions:
                    </p>
                    <ol className="space-y-3 text-sm">
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
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border-2 border-green-300 dark:border-green-700">
                    <p className="font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                      <span className="text-2xl">🤖</span> Android Instructions:
                    </p>
                    <ol className="space-y-3 text-sm">
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
                  <p className="text-xs text-muted-foreground mb-3">
                    💡 <strong>Why add to home screen?</strong>
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✅ Quick access from your home screen</li>
                    <li>✅ Works offline</li>
                    <li>✅ Faster than opening your browser</li>
                    <li>✅ Looks and feels like a native app</li>
                  </ul>
                </div>

                <Button
                  onClick={() => setShowInstructions(false)}
                  variant="outline"
                  className="w-full"
                  data-testid="button-close-instructions"
                >
                  Got it
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center justify-center gap-3 text-xl sm:text-2xl">
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

          {!showInstructions && (
            <div className="mt-8 p-4 sm:p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong>Tip:</strong> Add this app to your home screen for quick access.
                Tap the button above for instructions!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
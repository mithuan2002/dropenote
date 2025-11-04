

import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, UserCircle, Download, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

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
  }, [setLocation]);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebApp = (window.navigator as any).standalone === true;

    if (isStandalone || isInWebApp) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      console.log('[Home] Install prompt captured');
      setDeferredPrompt(e);
    };

    const installedHandler = () => {
      console.log('[Home] App installed');
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowInstructions(false);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    // Check if prompt is already available from main.tsx
    if ((window as any).deferredPrompt) {
      console.log('[Home] Using existing deferred prompt');
      setDeferredPrompt((window as any).deferredPrompt);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    console.log('[Home] Install button clicked, deferredPrompt:', !!deferredPrompt);
    
    if (!deferredPrompt) {
      console.log('[Home] No deferred prompt - checking window');
      const globalPrompt = (window as any).deferredPrompt;
      if (globalPrompt) {
        setDeferredPrompt(globalPrompt);
        try {
          await globalPrompt.prompt();
          const { outcome } = await globalPrompt.userChoice;
          console.log('[Home] Install outcome:', outcome);
          if (outcome === 'accepted') {
            setIsInstalled(true);
            setDeferredPrompt(null);
            (window as any).deferredPrompt = null;
          }
        } catch (error) {
          console.error('[Home] Install error:', error);
        }
        return;
      }
      console.log('[Home] No install prompt available anywhere');
      setShowInstructions(true);
      return;
    }

    try {
      console.log('[Home] Showing install prompt');
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[Home] User choice:', outcome);
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      (window as any).deferredPrompt = null;
    } catch (error) {
      console.error('[Home] Install prompt error:', error);
    }
  };

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
                onClick={handleInstall}
                size="lg"
                className="w-full max-w-md min-h-[64px] text-xl font-bold shadow-xl hover:shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
                data-testid="button-install-pwa"
              >
                <Download className="mr-3 h-6 w-6" />
                Install App Now
              </Button>
              <p className="text-xs text-muted-foreground">
                Works offline • Fast loading • Native experience
              </p>
            </div>
          )}

          {showInstructions && (
            <Card className="text-left border-2 border-blue-500 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Install Instructions
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Your browser requires manual installation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3 text-sm">
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <p className="font-semibold mb-1">🍎 iPhone/iPad (Safari):</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Tap the Share button <span className="font-mono">⎙</span></li>
                      <li>Scroll and tap "Add to Home Screen"</li>
                      <li>Tap "Add"</li>
                    </ol>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <p className="font-semibold mb-1">🤖 Android (Chrome):</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Tap menu <span className="font-mono">⋮</span> (top right)</li>
                      <li>Tap "Install app" or "Add to Home screen"</li>
                      <li>Tap "Install"</li>
                    </ol>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg">
                    <p className="font-semibold mb-1">💻 Desktop (Chrome/Edge):</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Look for install icon <span className="font-mono">⊕</span> in address bar</li>
                      <li>Or menu → "Install Dropnote"</li>
                      <li>Click "Install"</li>
                    </ol>
                  </div>
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

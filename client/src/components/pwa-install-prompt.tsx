import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebApp = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInWebApp) {
      setIsInstalled(true);
      return;
    }

    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowPrompt(true);
      console.log('[PWA] Install prompt available');
    };

    const installedHandler = () => {
      console.log('[PWA] App installed successfully');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`[PWA] User choice: ${outcome}`);
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('[PWA] Install prompt error:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <Card className="relative border-2 border-primary shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Dismiss"
        data-testid="button-dismiss-pwa"
      >
        <X className="h-4 w-4" />
      </button>
      
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary rounded-full">
            <Smartphone className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">Install Dropnote App</CardTitle>
            <CardDescription className="text-sm mt-1">
              Get quick access from your home screen
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span>Works offline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📱</span>
            <span>Native experience</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🚀</span>
            <span>Fast loading</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔔</span>
            <span>Push notifications</span>
          </div>
        </div>
        
        <Button 
          onClick={handleInstallClick}
          size="lg"
          className="w-full h-14 text-lg font-semibold shadow-md hover:shadow-lg transition-all"
          data-testid="button-install-pwa"
        >
          <Download className="mr-2 h-5 w-5" />
          Install Now
        </Button>
      </CardContent>
    </Card>
  );
}

import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users2, Store, BarChart3, Check } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetch('/api/auth/status')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          if (data.role === 'brand') {
            setLocation('/brand');
          } else if (data.role === 'staff') {
            setLocation('/staff');
          }
        }
      })
      .catch(() => {
      });
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="font-semibold text-lg">Dropnote</div>
            <Button asChild variant="ghost" size="sm" data-testid="button-login">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="text-center space-y-6 sm:space-y-8 animate-fade-in">
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs sm:text-sm">
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium">For E-commerce Brands</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight px-2">
              Run promo campaigns{" "}
              <span className="text-primary">without website integration</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              Create hosted campaign pages with promo codes. Customers enter their details and code to unlock your discounted checkout link. No developer needed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-2">
            <Button asChild size="lg" className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold" data-testid="button-get-started">
              <Link href="/login">
                Get Started <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base" data-testid="button-learn-more">
              <a href="https://wa.me/919600267509" target="_blank" rel="noopener noreferrer">
                Have doubts? Let's chat
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t py-12 sm:py-16">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="mb-2">Platform Features</h2>
          </div>

          <div className="grid gap-4">
            {/* Brand Card */}
            <div className="bg-card border border-border rounded-lg p-5 transition-colors hover:border-foreground/20">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-foreground/5 rounded-md flex items-center justify-center">
                  <Users2 className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-sm font-semibold">Brand Dashboard</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Create campaigns with promo codes, get hosted landing pages, and track customer submissions with real-time analytics.
                  </p>
                  <Button asChild variant="ghost" size="sm" className="h-auto p-0 text-sm hover:bg-transparent" data-testid="link-brand-signup">
                    <Link href="/login?role=brand">
                      Get started <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Staff Card */}
            <div className="bg-card border border-border rounded-lg p-5 transition-colors hover:border-foreground/20">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-foreground/5 rounded-md flex items-center justify-center">
                  <Store className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-sm font-semibold">Staff Portal</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Instant code verification at checkout. Mobile-optimized for quick validation. One-time use fraud prevention.
                  </p>
                  <Button asChild variant="ghost" size="sm" className="h-auto p-0 text-sm hover:bg-transparent" data-testid="link-staff-signup">
                    <Link href="/login?role=staff">
                      Access portal <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="bg-card border border-border rounded-lg p-5 transition-colors hover:border-foreground/20">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-foreground/5 rounded-md flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-sm font-semibold">Real-time Analytics</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Monitor performance in real-time. Track follower conversions, revenue impact, and campaign ROI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t py-12 sm:py-16">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <div className="mb-6">
            <h2 className="mb-1">How it works</h2>
            <p className="text-sm text-muted-foreground">Three steps to start tracking</p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-md bg-foreground/5 flex items-center justify-center text-xs font-medium">
                1
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-0.5">Create campaign</h3>
                <p className="text-sm text-muted-foreground">
                  Set promo code, discount, checkout URLs, and get a hosted campaign page (dropnote.com/c/your-slug)
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-md bg-foreground/5 flex items-center justify-center text-xs font-medium">
                2
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-0.5">Share campaign link</h3>
                <p className="text-sm text-muted-foreground">
                  Promote your campaign URL on social media, ads, or email. No website integration needed.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-md bg-foreground/5 flex items-center justify-center text-xs font-medium">
                3
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-0.5">Collect leads and track</h3>
                <p className="text-sm text-muted-foreground">
                  Customers enter promo code and contact info. Track valid submissions and conversion rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y bg-foreground/[0.02] py-12 sm:py-16">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <div className="max-w-lg">
            <h2 className="mb-2">Launch your first campaign</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Join e-commerce brands running promo campaigns without technical complexity
            </p>
            <Button asChild className="w-full sm:w-auto h-10" data-testid="button-cta-signup">
              <Link href="/login">
                Create account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6 py-6">
          <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
            <p>© 2025 Dropnote</p>
            <p>Made with 💙 from Coimbatore</p>
            <a href="mailto:mithuan137@gmail.com" className="hover:text-foreground transition-colors flex items-center gap-1">
              <span>✉</span>
              <span>mithuan137@gmail.com</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

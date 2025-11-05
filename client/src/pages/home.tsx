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
          if (data.role === 'influencer') {
            setLocation('/influencer');
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
      <section className="mx-auto max-w-screen-md px-4 sm:px-6 py-12 sm:py-16">
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-3">
            <h1 className="max-w-2xl">
              Coupon tracking for influencers
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
              Distribute trackable discount codes to your followers. Monitor redemptions in real-time. Build data-driven partnerships with brands.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="h-10" data-testid="button-get-started">
              <Link href="/login">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10" data-testid="button-learn-more">
              <Link href="#features">
                View Features
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t py-12 sm:py-16">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="mb-2">Platform Features</h2>
            <p className="text-sm text-muted-foreground">
              Built for creators, retailers, and followers
            </p>
          </div>

          <div className="grid gap-4">
            {/* Influencer Card */}
            <div className="bg-card border border-border rounded-lg p-5 transition-colors hover:border-foreground/20">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-foreground/5 rounded-md flex items-center justify-center">
                  <Users2 className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-sm font-semibold">Creator Dashboard</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Create campaigns, distribute unique codes, and track redemptions. Real conversion data to prove your influence.
                  </p>
                  <Button asChild variant="ghost" size="sm" className="h-auto p-0 text-sm hover:bg-transparent" data-testid="link-creator-signup">
                    <Link href="/login?role=influencer">
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
                  Set discount percentage, expiration date, and generate shareable link
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-md bg-foreground/5 flex items-center justify-center text-xs font-medium">
                2
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-0.5">Distribute to followers</h3>
                <p className="text-sm text-muted-foreground">
                  Share campaign URL via social media, stories, or direct messages
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-md bg-foreground/5 flex items-center justify-center text-xs font-medium">
                3
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-0.5">Monitor results</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time analytics on redemptions, revenue, and conversion rates
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
            <h2 className="mb-2">Start tracking campaigns</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Join creators using data-driven insights to strengthen brand partnerships
            </p>
            <Button asChild className="h-10" data-testid="button-cta-signup">
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-muted-foreground">
            <p>© 2024 Dropnote</p>
            <div className="flex gap-4">
              <Link href="/login?role=influencer" className="hover:text-foreground transition-colors" data-testid="link-footer-creator">Creators</Link>
              <Link href="/login?role=staff" className="hover:text-foreground transition-colors" data-testid="link-footer-staff">Staff</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

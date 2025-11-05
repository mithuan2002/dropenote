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
      <section className="mx-auto max-w-screen-md px-4 sm:px-6 py-16 sm:py-24">
        <div className="space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-xs font-medium">
            Trusted by creators
          </div>
          
          <div className="space-y-4">
            <h1 className="max-w-2xl">
              Reward your followers with trackable coupons
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              Create exclusive discount codes for your audience. Track every redemption. 
              Prove your real influence to brands.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="transition-all duration-200 hover:shadow-lg" data-testid="button-get-started">
              <Link href="/login">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" data-testid="button-learn-more">
              <Link href="#how-it-works">
                How it works
              </Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="pt-8 flex items-center gap-8 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Free to get started</span>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section id="how-it-works" className="border-y bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="mb-3">Built for everyone in the coupon ecosystem</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're a creator, running a store, or tracking campaign performance
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8">
            {/* Influencer Card */}
            <div className="group bg-card border rounded-lg p-6 sm:p-8 transition-all duration-200 hover:shadow-md animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users2 className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">For Creators</h3>
                  <p className="text-sm text-muted-foreground">
                    Create campaigns, generate unique codes for your followers, and track every redemption. 
                    Build proof of your influence with real conversion data.
                  </p>
                  <Button asChild variant="ghost" className="h-auto p-0 font-normal text-foreground hover:text-foreground" data-testid="link-creator-signup">
                    <Link href="/login?role=influencer">
                      Sign up as creator <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Staff Card */}
            <div className="group bg-card border rounded-lg p-6 sm:p-8 transition-all duration-200 hover:shadow-md animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Store className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">For Store Staff</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify coupon codes instantly at checkout. Mobile-optimized interface for quick validation. 
                    Prevent fraud with one-time use codes.
                  </p>
                  <Button asChild variant="ghost" className="h-auto p-0 font-normal text-foreground hover:text-foreground" data-testid="link-staff-signup">
                    <Link href="/login?role=staff">
                      Sign in as staff <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="group bg-card border rounded-lg p-6 sm:p-8 transition-all duration-200 hover:shadow-md animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">Campaign Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor campaign performance in real-time. See which followers convert, track revenue impact, 
                    and export reports to share with brand partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="mb-3">Simple, transparent process</h2>
            <p className="text-muted-foreground">Get started in minutes</p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4 items-start animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create your campaign</h3>
                <p className="text-sm text-muted-foreground">
                  Set up your discount, add campaign details, and generate shareable links
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Share with your audience</h3>
                <p className="text-sm text-muted-foreground">
                  Post your campaign link on social media, stories, or direct messages
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Track and grow</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor redemptions in real-time and use the data to grow your partnerships
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6 text-center">
          <h2 className="mb-4">Ready to start tracking your influence?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join creators who are building stronger relationships with their audience through trackable campaigns
          </p>
          <Button asChild size="lg" className="transition-all duration-200 hover:shadow-lg" data-testid="button-cta-signup">
            <Link href="/login">
              Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 Dropnote</p>
            <div className="flex gap-6">
              <Link href="/login?role=influencer" data-testid="link-footer-creator">For Creators</Link>
              <Link href="/login?role=staff" data-testid="link-footer-staff">For Staff</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

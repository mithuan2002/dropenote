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
              <span className="font-medium">For E-commerce Stores</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight px-2">
              Make more sales from{" "}
              <span className="text-primary">every coupon you run</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              Launch coupons, engage customers, and track real conversions for your online store.
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

      {/* Problem Section */}
      <section className="border-t py-12 sm:py-16">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">The Problem</h2>
            <p className="text-muted-foreground mt-2">
              You share discount codes everywhere but can't track who uses them or which channels drive sales.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="border-t py-12 sm:py-16 bg-foreground/[0.02]">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">What You Get</h2>
          </div>

          <div className="grid gap-6">
            <div className="bg-background border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users2 className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Customer data from every coupon</h3>
                  <p className="text-sm text-muted-foreground">
                    Build your contact list automatically
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">See which campaigns convert</h3>
                  <p className="text-sm text-muted-foreground">
                    Stop wasting money on campaigns that don't work
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Check className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Branding</h3>
                  <p className="text-sm text-muted-foreground">
                    Custom campaign pages that match your brand
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Impact */}
      <section className="border-t py-12 sm:py-16">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">The Result</h2>
            <p className="text-muted-foreground mb-8">
              Turn one-time discounts into repeat customers
            </p>
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

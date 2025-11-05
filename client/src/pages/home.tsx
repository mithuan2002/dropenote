
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, UserCircle, TrendingUp, Users, Shield, BarChart3, Zap, CheckCircle2 } from "lucide-react";
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
      {/* Hero Section */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-sm font-medium text-primary">For Creators</span>
            </div>
            
            <div className="text-5xl sm:text-7xl font-bold text-primary mb-2">
              Dropnote
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Reward your followers with <span className="text-primary">trackable coupons</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Give your followers exclusive coupon codes and giveaways they can claim in-store. Track every redemption to show brands your real influence.
            </p>

            <div className="flex justify-center pt-4">
              <Button asChild size="lg" className="text-base font-semibold">
                <Link href="/login">
                  Get Started for Free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Dropnote?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete solution for influencer-driven marketing campaigns with built-in analytics and fraud prevention
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Campaign Analytics</CardTitle>
              <CardDescription className="text-base">
                Track redemption rates, revenue impact, and follower engagement in real-time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Follower Identification</CardTitle>
              <CardDescription className="text-base">
                Collect WhatsApp numbers to identify your most valuable supporters automatically
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Fraud Prevention</CardTitle>
              <CardDescription className="text-base">
                One-time use codes with instant verification to prevent abuse and duplicate claims
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Performance Insights</CardTitle>
              <CardDescription className="text-base">
                Detailed breakdowns of campaign performance with exportable reports
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Instant Redemption</CardTitle>
              <CardDescription className="text-base">
                Staff can verify codes in seconds with mobile-optimized interface
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Simple Setup</CardTitle>
              <CardDescription className="text-base">
                Create campaigns in minutes and share links instantly with your audience
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/50 border-y">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to launch your campaign</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Create Campaign</h3>
              <p className="text-muted-foreground">
                Set up your discount, configure settings, and generate unique coupon codes
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Share with Followers</h3>
              <p className="text-muted-foreground">
                Distribute campaign link via social media, stories, or direct messages
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Track Results</h3>
              <p className="text-muted-foreground">
                Monitor redemptions, analyze performance, and grow your loyal community
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl border-2 border-primary/20 p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to grow your influence?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join successful influencers who are using Dropnote to build stronger connections with their audience
          </p>
          <Button asChild size="lg" className="text-base font-semibold">
            <Link href="/login?role=influencer">
              Get Started for Free
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Dropnote. Professional coupon management for influencers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

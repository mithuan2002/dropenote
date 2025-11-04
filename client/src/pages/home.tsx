import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, UserCircle } from "lucide-react";
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

          <div className="mb-4">
            
          </div>

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
        </div>
      </div>
    </div>
  );
}

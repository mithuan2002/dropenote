import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { UserGuide } from "@/components/user-guide";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isLoading = loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin 
        ? { username, password }
        : { username, password, role: "brand" };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: `Logged in as ${data.username}`,
      });

      // Use full page redirect to ensure auth state is fresh
      window.location.href = "/brand";
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Authentication failed";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            <Link href="/">
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to home</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin 
                ? "Sign in to access your dashboard" 
                : "Get started with Dropnote today"}
            </p>
          </div>

          {!isLogin && (
            <UserGuide
              title="Account Setup Guide"
              steps={[
                "Create a username (min. 3 characters)",
                "Set a strong password (min. 6 characters)",
                "Click 'Create account' to get started"
              ]}
              tips={[
                "Create campaigns with promo codes and track customer submissions",
                "Engage customers and track real conversions"
              ]}
            />
          )}

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-10 text-sm"
                    placeholder="Enter your username"
                    required
                    minLength={3}
                    data-testid="input-username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 text-sm"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                    data-testid="input-password"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-3 text-sm text-destructive bg-destructive/5 p-3 rounded-md border border-destructive/20">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-10 text-sm font-medium" 
                  disabled={isLoading} 
                  data-testid="button-submit"
                >
                  {isLoading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 text-sm"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  data-testid="button-toggle-mode"
                >
                  {isLogin ? "Create new account" : "Sign in instead"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

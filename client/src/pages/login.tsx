import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"influencer" | "staff">("influencer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State to hold error messages
  const isLoading = loading; // Alias for clarity in JSX

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin 
        ? { username, password }
        : { username, password, role };

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
      if (data.role === "influencer") {
        window.location.href = "/influencer";
      } else {
        window.location.href = "/staff";
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Authentication failed";
      setError(errorMessage); // Set error state
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-3xl text-center font-bold">
            {isLogin ? (role === 'influencer' ? '🛍️ Influencer Login' : '🏪 Staff Login') : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {isLogin 
              ? (role === 'influencer' ? 'Access your campaign dashboard' : 'Verify and redeem coupons')
              : 'Sign up for a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role" className="text-base font-semibold">Account Type</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as "influencer" | "staff")}
                  className="w-full h-12 px-3 rounded-md border border-input bg-background text-base focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                  data-testid="select-role"
                >
                  <option value="influencer">Influencer</option>
                  <option value="staff">Store Staff</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-base font-semibold">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 text-base"
                placeholder="Enter username"
                required
                minLength={3}
                data-testid="input-username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base"
                placeholder="Enter password"
                required
                minLength={6}
                data-testid="input-password"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-4 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-14 text-lg font-semibold" disabled={isLoading} data-testid="button-submit">
              {isLoading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-base"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(""); // Clear error when toggling mode
              }}
              data-testid="button-toggle-mode"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
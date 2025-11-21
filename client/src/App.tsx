import { Switch, Route, useLocation } from "wouter";
import { queryClient, getQueryFn } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import Home from "@/pages/home";
import Login from "@/pages/login";
import BrandDashboard from "@/pages/brand-dashboard";
import BrandProfile from "@/pages/brand-profile";
import CampaignDetail from "@/pages/campaign-detail";
import StaffPortal from "@/pages/staff-portal";
import StaffProfile from "@/pages/staff-profile";
import CampaignPage from "@/pages/campaign-page";
import NotFound from "@/pages/not-found";
import type { User } from "@shared/schema";

function ProtectedRoute({ component: Component, requiredRole }: { component: any; requiredRole?: string }) {
  const [, setLocation] = useLocation();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    } else if (!isLoading && requiredRole && user?.role !== requiredRole) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation, requiredRole]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/c/:slug" component={CampaignPage} />
      <Route path="/brand">
        {() => <ProtectedRoute component={BrandDashboard} requiredRole="brand" />}
      </Route>
      <Route path="/brand/profile">
        {() => <ProtectedRoute component={BrandProfile} requiredRole="brand" />}
      </Route>
      <Route path="/brand/campaigns/:id" component={CampaignDetail} />
      <Route path="/staff">
        {() => <ProtectedRoute component={StaffPortal} requiredRole="staff" />}
      </Route>
      <Route path="/staff/profile">
        {() => <ProtectedRoute component={StaffProfile} requiredRole="staff" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
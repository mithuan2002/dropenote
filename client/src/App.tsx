import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import InfluencerDashboard from "@/pages/influencer-dashboard";
import CampaignList from "@/pages/campaign-list";
import CampaignDetail from "@/pages/campaign-detail";
import StaffPortal from "@/pages/staff-portal";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/influencer" component={InfluencerDashboard} />
      <Route path="/campaigns" component={CampaignList} />
      <Route path="/campaigns/:id" component={CampaignDetail} />
      <Route path="/staff" component={StaffPortal} />
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

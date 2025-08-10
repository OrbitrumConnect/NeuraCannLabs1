import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScanProvider } from "@/contexts/ScanContext";
import Dashboard from "@/pages/Dashboard";
import GlobalAdminDashboard from "@/pages/GlobalAdminDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard/:section?" component={Dashboard} />
      <Route path="/admin" component={GlobalAdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScanProvider>
          <div className="dark">
            <Toaster />
            <Router />
          </div>
        </ScanProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

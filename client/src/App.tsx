import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScanProvider } from "@/contexts/ScanContext";
import Dashboard from "@/pages/Dashboard";
import GlobalAdminDashboard from "@/pages/GlobalAdminDashboard";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";

function Router() {
  // Verificar se existe usuário logado
  const user = localStorage.getItem('user');
  const isLoggedIn = user && JSON.parse(user).id;

  return (
    <Switch>
      <Route path="/landing" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/" component={isLoggedIn ? Dashboard : Landing} />
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

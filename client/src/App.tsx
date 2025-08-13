import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScanProvider } from "@/contexts/ScanContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import Dashboard from "@/pages/Dashboard";
import GlobalAdminDashboard from "@/pages/GlobalAdminDashboard";
import PlansPage from "@/pages/PlansPage";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import CriticalModulesDashboard from "@/pages/CriticalModulesDashboard";
import ModuleDetailView from "@/pages/ModuleDetailView";
import DraCannabisPage from "@/pages/DraCannabisPage";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import MedicalDashboard from "@/pages/MedicalDashboard";
import PatientDashboard from "@/pages/PatientDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import RoleSelector from "@/components/RoleSelector";
import NotFound from "@/pages/not-found";

function Router() {
  // Verificar se existe usuário logado e seu role
  const user = localStorage.getItem('user');
  let userData = null;
  let isLoggedIn = false;
  let userRole = null;
  
  try {
    if (user && user !== 'undefined' && user !== 'null') {
      userData = JSON.parse(user);
      isLoggedIn = userData && userData.id;
      userRole = userData?.role;
    }
  } catch (error) {
    console.error('Erro ao fazer parse do usuário:', error);
    localStorage.removeItem('user'); // Remove dados corrompidos
  }

  // Função para determinar dashboard baseado no role
  const getDashboardComponent = () => {
    if (!isLoggedIn) return Landing;
    
    // SE É ADMIN - vai direto para AdminDashboard
    if (userRole === 'admin' || userData?.email === 'phpg69@gmail.com') {
      return AdminDashboard;
    }
    
    // SE É MÉDICO - vai para Dashboard principal
    if (userRole === 'medico') {
      return Dashboard;
    }
    
    // SE É PACIENTE - vai para PatientDashboard  
    if (userRole === 'paciente') {
      return PatientDashboard;
    }
    
    // SE NÃO TEM ROLE E NÃO É ADMIN - vai para dashboard padrão
    // (seletor será implementado depois se necessário)
    
    // DEFAULT - dashboard normal
    return Dashboard;
  };

  return (
    <Switch>
      <Route path="/landing" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/plans" component={PlansPage} />
      <Route path="/" component={getDashboardComponent()} />
      <Route path="/dashboard/:section?" component={Dashboard} />
      <Route path="/medical" component={MedicalDashboard} />
      <Route path="/patient" component={PatientDashboard} />
      <Route path="/dashboard/module/:moduleId" component={ModuleDetailView} />
      <Route path="/dra-cannabis" component={DraCannabisPage} />
      <Route path="/admin" component={() => <GlobalAdminDashboard onBackToOverview={() => {}} />} />
      <Route path="/analytics" component={AnalyticsDashboard} />
      <Route path="/critical-modules" component={CriticalModulesDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <ScanProvider>
            <div>
              <Toaster />
              <Router />
            </div>
          </ScanProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

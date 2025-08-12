import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Sustainability from "./pages/Sustainability";
import NotFound from "./pages/NotFound";
import { CommunityHub } from "@/components/community/CommunityHub";
import { AIRiskAssessment } from "@/components/ai/AIRiskAssessment";
import { DeviceIntegration } from "@/components/devices/DeviceIntegration";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<OnboardingFlow />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/community" element={<CommunityHub />} />
            <Route path="/ai-assessment" element={<AIRiskAssessment />} />
            <Route path="/devices" element={<DeviceIntegration />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

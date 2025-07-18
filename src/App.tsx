
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ReportProblem from "./pages/ReportProblem";
import Clarification from "./pages/Clarification";
import ChangeRequest from "./pages/ChangeRequest";
import SearchIssue from "./pages/SearchIssue";
import LoginPage from "./pages/LoginPage";
import ITHelpdeskView from "./pages/ITHelpdeskView";
import ITPerformanceDashboard from "./pages/ITPerformanceDashboard";
import TicketSummary from "./pages/TicketSummary";
import TicketDetails from "./pages/TicketDetails";
import Response from "./pages/Response";
import UserID from "./pages/UserID";
import ITEscalationMatrix from "./pages/ITEscalationMatrix";
import PreviouslySubmittedTickets from "./pages/PreviouslySubmittedTickets";
import ProblemsPage from './pages/ProblemsPage';
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/index" element={<Index />} />
          <Route path="/report-problem" element={<ReportProblem />} />
          <Route path="/clarification" element={<Clarification />} />
          <Route path="/change-request" element={<ChangeRequest />} />
          <Route path="/search-issue" element={<SearchIssue />} />
          <Route path="/it-helpdesk-view" element={<ITHelpdeskView />} />
          <Route path="/it-performance-dashboard" element={<ITPerformanceDashboard />} />
          <Route path="/ticket-summary" element={<TicketSummary />} />
          <Route path="/ticket-details" element={<TicketDetails />} />
          <Route path="/response" element={<Response />} />
          <Route path="/userID" element={<UserID />} />
          <Route path="/it-escalation-matrix" element={<ITEscalationMatrix />} />
          <Route path="/my-tickets" element={<PreviouslySubmittedTickets />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/previously-submitted-tickets" element={<PreviouslySubmittedTickets />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE  */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
